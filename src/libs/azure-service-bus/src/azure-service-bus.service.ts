import {
  ServiceBusClient,
  ServiceBusReceivedMessage,
  ServiceBusReceiver,
} from '@azure/service-bus';
import { IAzureServiceBusService } from './azure-service-bus.interface';
import { EventData } from '@azure/event-hubs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DataBody } from '../../core/types';
import { RECEIVE_DATA_TOKEN } from '../../core/symbol';

@Injectable()
export class AzureServiceBusService implements IAzureServiceBusService {
  private readonly logger = new Logger(AzureServiceBusService.name);
  private receiver: ServiceBusReceiver;
  private serviceBusClient: ServiceBusClient;
  constructor() {
    this.serviceBusClient = new ServiceBusClient(
      process.env.SERVICE_BUS_CONNECTION_STRING,
    );
  }

  // publish to service bus
  async forwardEventsToServiceBusQueue(eventData: EventData): Promise<void> {
    try {
      const queueName = eventData?.properties?.propertyName;
      const sender = this.serviceBusClient.createSender(queueName);
      const message = {
        body: JSON.stringify(eventData?.body),
      };
      await sender.sendMessages([message]);
      this.logger.debug(`event forwarded to "Azure Service Bus" queue`);
    } catch (err: unknown) {
      this.logger.error(`error forwarding event to "Azure Service Bus" queue`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // subscribe from service bus
  async subscribeToQueue(queueName: string): Promise<void> {
    const receiver = this.serviceBusClient.createReceiver(queueName);

    let data: any;

    receiver.subscribe(
      {
        processMessage: async (message: ServiceBusReceivedMessage) => {
          try {
            this.logger.debug('received message:', message.messageId);
            data = {
              messageId: message.messageId,
              content: JSON.parse(message?.body).content,
              postId: JSON.parse(message?.body).postId,
            };
            const messageId = await this.sendToMicroservice(data, queueName);
            if (message.messageId == messageId) {
              this.logger.debug('acknowledge message:', message.messageId);
              await receiver.completeMessage(message);
            }
          } catch (error) {
            this.logger.error('error processing message:', error);
            await receiver.abandonMessage(message);
            throw new HttpException(
              'Internal server error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        },
        processError: async (args) => {
          this.logger.error('error in message handler:', args.error);
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        },
      },
      {
        autoCompleteMessages: false,
      },
    );
  }

 private async sendToMicroservice(data: DataBody, queueName: string): Promise<string> {
    let msg = '';
    const port =
      queueName === 'post-queue'
        ? process.env.POST_PORT
        : process.env.COMMENT_PORT;
    await axios
      .post(`http://${process.env.URL_HOST}:${port}/${RECEIVE_DATA_TOKEN}`, {
        data,
      })
      .then((response) => {
        this.logger.debug('data sent to microservice:', response.data);
        msg = response.data;
      })
      .catch((error) => {
        this.logger.error('error sending data to microservice:', error);
        msg = '';
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return msg;
  }
}
