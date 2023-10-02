import { DataBody } from '../../core/types';

export interface IMongoService {
  savePost(post: Omit<DataBody, 'id'>): Promise<string>;
  saveComment(post: Omit<DataBody, 'id'>): Promise<string>;
}
