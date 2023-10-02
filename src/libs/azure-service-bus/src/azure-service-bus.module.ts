import { Module } from '@nestjs/common';
import { AzureServiceBusService } from './azure-service-bus.service';
import { AZURE_SERVICE_BUS_TOKEN } from '../../core/symbol';

@Module({
  providers: [
    AzureServiceBusService,
    {
      provide: AZURE_SERVICE_BUS_TOKEN,
      useClass: AzureServiceBusService,
    },
  ],
  exports: [AzureServiceBusService, AZURE_SERVICE_BUS_TOKEN],
})
export class AzureServiceBusModule {}
