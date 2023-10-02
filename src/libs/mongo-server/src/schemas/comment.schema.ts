import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { DataBody } from '../../../core/types';
@Schema()
export class Comment implements DataBody {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  postId: string;
  @Prop({ required: true })
  messageId: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
