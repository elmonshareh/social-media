import { Module } from '@nestjs/common';
import { AzureEventHubService } from './azure-event-hubs.service';
import { AZURE_EVENT_HUB_TOKEN } from '../../core/symbol';
import { AzureServiceBusModule } from 'src/libs/azure-service-bus';

@Module({
  imports: [AzureServiceBusModule],
  providers: [
    AzureEventHubService,
    {
      provide: AZURE_EVENT_HUB_TOKEN,
      useClass: AzureEventHubService,
    },
  ],
  exports: [AzureEventHubService, AZURE_EVENT_HUB_TOKEN],
})
export class AzureEventHubsModule {}
