import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IAzureEventHubService } from './libs/azure-event-hubs';
import { AzureEventHubBody } from './libs/core/event';
import { IAdapterService } from './microservice-adapter.interface';
import { AZURE_EVENT_HUB_TOKEN } from './libs/core/symbol';

@Injectable()
export class AdapterService implements IAdapterService {
  private readonly logger = new Logger(AdapterService.name);
  constructor(
    @Inject(AZURE_EVENT_HUB_TOKEN)
    private readonly azureEventHubService: IAzureEventHubService,
  ) {}

  async sendEvent(payload: AzureEventHubBody): Promise<void> {
    try {
      await this.azureEventHubService.sendEvent(payload);
    } catch (err: unknown) {
      this.logger.error(`error while sending event to "Azure Event Hubs"`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async startConsumer(): Promise<void> {
    try {
      await this.azureEventHubService.startConsumer();
    } catch (err: unknown) {
      this.logger.error(`error while consuming event to "Azure Event Hubs"`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
