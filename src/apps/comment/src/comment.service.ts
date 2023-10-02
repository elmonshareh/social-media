import { Injectable, Inject, Logger } from '@nestjs/common';
import { IMongoService } from '../../../libs/mongo-server';
import { MONGO_SERVICE_TOKEN } from '../../../libs/core/symbol';
import { DataBody } from '../../../libs/core/types';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  constructor(
    @Inject(MONGO_SERVICE_TOKEN)
    private readonly mongoService: IMongoService,
  ) {}

  async saveComment(data: DataBody): Promise<string> {
    try {
      return await this.mongoService.saveComment(data);
    } catch (err: unknown) {
      this.logger.error(`error while getting message from client: `, err);
    }
  }
}
