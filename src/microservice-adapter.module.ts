import { Module } from '@nestjs/common';
import { AdapterController } from './microservice-adapter.controller';
import { AdapterService } from './microservice-adapter.service';
import { AzureEventHubsModule } from './libs/azure-event-hubs/src/azure-event-hubs.module';
import { AzureServiceBusService } from './libs/azure-service-bus/src/azure-service-bus.service';
import { AzureServiceBusModule } from './libs/azure-service-bus/src/azure-service-bus.module';
import { SocketIoModule } from './libs/socket.io';
import { APP_SERVICE_TOKEN } from './libs/core/symbol';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AzureEventHubsModule,
    AzureServiceBusModule,
    SocketIoModule,
  ],
  controllers: [AdapterController],
  providers: [
    { provide: APP_SERVICE_TOKEN, useClass: AdapterService },
    AzureServiceBusService,
  ],
})
export class AppModule {}
