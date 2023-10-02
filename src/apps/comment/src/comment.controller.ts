import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { DataBody } from '../../../libs/core/types';
import { RECEIVE_DATA_TOKEN } from '../../../libs/core/symbol';

@Controller()
export class CommentController {
  private readonly logger = new Logger(CommentController.name);
  constructor(private readonly commentService: CommentService) {}
  @Post(RECEIVE_DATA_TOKEN)
  async postData(@Body() body: any): Promise<string> {
    try {
      const dataBody: DataBody = body?.data;
      this.logger.debug(`received message from client: `, dataBody);

      if (!dataBody.messageId) {
        return '';
      }
      return await this.commentService.saveComment(dataBody);
    } catch (err: unknown) {
      this.logger.error(`error while getting message from client: `, err);
    }
  }
}
