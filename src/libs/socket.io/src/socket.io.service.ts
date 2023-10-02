import { Injectable } from '@nestjs/common/decorators';
import { ISocketIoService } from '../src/socket.io.interface';
import * as socketIo from 'socket.io';
import { Server } from 'http';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AzureEventHubBody } from '../../core/event';
import { MESSAGE_TOKEN } from '../../core/symbol';
import { Logger } from '@nestjs/common/services';

@Injectable()
export class SocketIoService implements ISocketIoService {
  private io: socketIo.Server;
  private readonly logger = new Logger(SocketIoService.name);
  constructor(private readonly eventEmitter: EventEmitter2) {
    this.io = new socketIo.Server({
      cors: {
        origin: '*',
      },
    });
  }

  async start(server: Server) {
    this.io.attach(server);
    this.io.on('connection', (socket: socketIo.Socket) => {
      this.logger.debug(`client connected`);
      socket.on(MESSAGE_TOKEN, async (data: AzureEventHubBody) => {
        const event: AzureEventHubBody = {
          body: data.body,
          properties: data.properties,
        };

        this.eventEmitter.emit(MESSAGE_TOKEN, event);
      });

      socket.on('disconnect', () => {
        this.logger.debug('client disconnected');
      });
    });
  }
}
