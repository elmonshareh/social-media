import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  EventHubProducerClient,
  EventData,
  EventHubConsumerClient,
} from '@azure/event-hubs';
import { IAzureEventHubService } from './azure-event-hubs.interface';
import { IAzureServiceBusService } from '../../azure-service-bus';
import { AZURE_SERVICE_BUS_TOKEN } from '../../core/symbol';

@Injectable()
export class AzureEventHubService implements IAzureEventHubService {
  private readonly logger = new Logger(AzureEventHubService.name);
  private eventHubProducerClient: EventHubProducerClient;
  private eventHubConsumerClient: EventHubConsumerClient;
  constructor(
    @Inject(AZURE_SERVICE_BUS_TOKEN)
    private readonly azureServiceBusService: IAzureServiceBusService,
  ) {
    this.eventHubProducerClient = new EventHubProducerClient(
      process.env.EVENT_HUB_CONNECTION_STRING,
      process.env.EVENT_HUB_NAME,
    );
    this.eventHubConsumerClient = new EventHubConsumerClient(
      process.env.EVENT_HUB_GROUP,
      process.env.EVENT_HUB_CONNECTION_STRING,
      process.env.EVENT_HUB_NAME,
    );
  }

  async sendEvent(eventData: EventData): Promise<void> {
    const batch = await this.eventHubProducerClient.createBatch();
    if (!batch.tryAdd(eventData)) {
      this.logger.error(`event is too large to fit in the batch`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      await this.eventHubProducerClient.sendBatch(batch);
      this.logger.debug(`messages were sent successfully`);
    } catch (err: unknown) {
      this.logger.error(`error sending messages: `, err);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async startConsumer(): Promise<void> {
    this.eventHubConsumerClient.subscribe(
      {
        processEvents: async (events) => {
          for (const event of events) {
            this.logger.debug('received event:', event.body);
            this.azureServiceBusService
              .forwardEventsToServiceBusQueue(event)
              .catch((err: unknown) =>
                this.logger.error(
                  `error forwarding event to "Azure Service Bus": `,
                  err,
                ),
              );
          }
        },
        processError: async (err: unknown) => {
          this.logger.error(`error while proccessing events`, err);
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        },
      },
      {
        startPosition: {
          isInclusive: false,
          enqueuedOn: new Date(),
        },
      },
    );
  }
}
