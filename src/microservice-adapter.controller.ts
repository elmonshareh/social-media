import {
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AzureEventHubBody } from './libs/core/event';
import { IAdapterService } from './microservice-adapter.interface';
import { MESSAGE_TOKEN, APP_SERVICE_TOKEN } from './libs/core/symbol';

@Controller()
export class AdapterController {
  private readonly logger = new Logger(AdapterController.name);
  constructor(
    @Inject(APP_SERVICE_TOKEN)
    private readonly appService: IAdapterService,
  ) {}
  @OnEvent(MESSAGE_TOKEN)
  async sendEventToEventhub(payload: AzureEventHubBody) {
    try {
      this.logger.debug(`sending event to "Azure Event Hubs" :`, payload?.body);
      await this.appService.sendEvent(payload);
    } catch (err: unknown) {
      this.logger.error(`error while sending event to "Azure Event Hubs"`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async onModuleInit() {
    try {
      this.logger.debug(`start consuming "Azure Event Hubs"`);
      await this.appService.startConsumer();
    } catch (err: unknown) {
      this.logger.error(`error while consuming event from "Azure Event Hubs"`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
