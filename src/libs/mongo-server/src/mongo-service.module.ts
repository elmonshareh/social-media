import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Post } from './schemas/post.schema';
import { CommentSchema, Comment } from './schemas/comment.schema';
import { MongoService } from './mongo-service.service';
import { MONGO_SERVICE_TOKEN } from '../../core/symbol';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  providers: [
    MongoService,
    {
      provide: MONGO_SERVICE_TOKEN,
      useClass: MongoService,
    },
  ],
  exports: [MongoService, MONGO_SERVICE_TOKEN],
})
export class MongoModule {}
