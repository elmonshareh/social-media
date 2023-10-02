import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { DataBody } from '../../core/types';
import { IMongoService } from './mongo-service.interface';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class MongoService implements IMongoService {
  private readonly logger = new Logger(MongoService.name);
  constructor(
    @InjectModel(Post.name) private post: Model<Post>,
    @InjectModel(Comment.name) private comment: Model<Comment>,
  ) {}

  async savePost(post: DataBody): Promise<string> {
    let messageId = '';
    try {
      const postBody: DataBody = {
        content: post?.content,
        messageId: post.messageId,
        createdAt: new Date(),
      };
      const model = new this.post(postBody);
      const save = await model.save({});
      this.logger.debug(`post saved successfully :`, save.messageId);

      messageId = save.messageId;
    } catch (err: unknown) {
      this.logger.error(`error happened while saving post :`, err);
      messageId = '';
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return messageId;
  }

  async saveComment(comment: Omit<DataBody, 'id'>): Promise<string> {
    let messageId = '';
    try {
      const postObj = await this.post.findOne({ _id: comment?.postId });
      if (!postObj) {
        this.logger.warn(`post not found`);
        messageId = '';
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      const commentBody: DataBody = {
        postId: comment?.postId,
        content: comment?.content,
        messageId: comment.messageId,
        createdAt: new Date(),
      };
      const model = new this.comment(commentBody);
      const save = await model.save({});
      this.logger.debug(`comment saved successfully :`, save.messageId);

      messageId = save.messageId;
    } catch (err: unknown) {
      this.logger.error(`error happened while saving comment :`, err);
      messageId = '';
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return messageId;
  }
}
