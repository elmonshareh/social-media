import { Server } from 'http';

export interface ISocketIoService {
  start(server: Server): Promise<any>;
}
