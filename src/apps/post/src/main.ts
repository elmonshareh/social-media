import { NestFactory } from '@nestjs/core';
import { AzureServiceBusService } from '../../../libs/azure-service-bus';
import { PostModule } from './post.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
async function bootstrap() {
  const app = await NestFactory.create(PostModule);
  const azureServiceBusReceiver = new AzureServiceBusService();
  await azureServiceBusReceiver.subscribeToQueue('post-queue');
  await app.listen(process.env.POST_PORT);
}

bootstrap();
