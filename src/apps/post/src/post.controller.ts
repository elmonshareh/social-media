import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { DataBody } from '../../../libs/core/types';
import { RECEIVE_DATA_TOKEN } from '../../../libs/core/symbol';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller()
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}
  @Post(RECEIVE_DATA_TOKEN)
  async postData(@Body() body: any): Promise<string> {
    try {
      const dataBody: DataBody = body?.data;
      this.logger.debug(`received message from client :`, dataBody);

      if (!dataBody.messageId) {
        return '';
      }
      return await this.postService.savePost(dataBody);
    } catch (err: unknown) {
      this.logger.error(`error while getting message from client: `, err);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
