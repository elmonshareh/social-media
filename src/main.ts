import { NestFactory } from '@nestjs/core';
import { AppModule } from './microservice-adapter.module';
import { SOCKET_ADAPTER_TOKEN } from './libs/core/symbol';
import { ISocketIoService } from './libs/socket.io';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
  });
  await app.startAllMicroservices();
  await app.listen(process.env.ADAPTER_PORT);
  const socketAdapter = app.get<ISocketIoService>(SOCKET_ADAPTER_TOKEN);
  await socketAdapter.start(app.getHttpServer());
}
bootstrap();
