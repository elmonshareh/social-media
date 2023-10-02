import { NestFactory } from '@nestjs/core';
import { AzureServiceBusService } from '../../../libs/azure-service-bus';
import { CommentModule } from './comment.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

async function bootstrap() {
  const app = await NestFactory.create(CommentModule);
  const azureServiceBusReceiver = new AzureServiceBusService();

  await azureServiceBusReceiver.subscribeToQueue('comment-queue');
  await app.listen(process.env.COMMENT_PORT);
}

bootstrap();
