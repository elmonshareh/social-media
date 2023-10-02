import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IMongoService } from '../../../libs/mongo-server';
import { MONGO_SERVICE_TOKEN } from '../../../libs/core/symbol';
import { DataBody } from '../../../libs/core/types';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @Inject(MONGO_SERVICE_TOKEN)
    private readonly mongoService: IMongoService,
  ) {}

  async savePost(data: DataBody): Promise<string> {
    try {
      return await this.mongoService.savePost(data);
    } catch (err: unknown) {
      this.logger.error(`error while getting message from client: `, err);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
