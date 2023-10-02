import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongoModule } from '../../../libs/mongo-server';
import { AppConfigModule } from '../../../libs/config/config.module';
import { ConfigService } from '../../../libs/config/config.service';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.databaseHost}:${configService.databasePort}/${configService.databaseName}`,
      }),
      inject: [ConfigService],
    }),
    MongoModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
