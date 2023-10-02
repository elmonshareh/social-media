import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataBody } from '../../../core/types';
@Schema()
export class Post implements DataBody {
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  messageId: string;
  @Prop({ required: true })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
