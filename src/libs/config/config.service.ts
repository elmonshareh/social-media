import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get databaseHost(): string {
    return this.configService.get<string>('MONGO_HOST');
  }

  get databasePort(): string {
    return this.configService.get<string>('MONGO_PORT');
  }

  get databaseName(): string {
    return this.configService.get<string>('MONGO_DB');
  }
}
