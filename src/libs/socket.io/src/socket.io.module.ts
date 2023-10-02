import { Module } from '@nestjs/common';
import { SocketIoService } from '../index';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SOCKET_ADAPTER_TOKEN } from '../../core/symbol';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    SocketIoService,
    {
      provide: SOCKET_ADAPTER_TOKEN,
      useClass: SocketIoService,
    },
  ],
  exports: [SOCKET_ADAPTER_TOKEN],
})
export class SocketIoModule {}
