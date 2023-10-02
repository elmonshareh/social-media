import { AzureEventHubBody } from './libs/core/event';

export interface IAdapterService {
  sendEvent(payload: AzureEventHubBody): Promise<void>;
  startConsumer(): Promise<void>;
}
