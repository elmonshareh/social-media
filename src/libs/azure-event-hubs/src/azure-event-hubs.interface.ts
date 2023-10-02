import { EventData } from '@azure/event-hubs';

export interface IAzureEventHubService {
  sendEvent(eventData: EventData): Promise<void>;
  startConsumer(): Promise<void>;
}
