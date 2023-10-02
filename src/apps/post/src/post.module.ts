import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongoModule } from '../../../libs/mongo-server';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../../../libs/config/config.module';
import { ConfigService } from '../../../libs/config/config.service';

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
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
