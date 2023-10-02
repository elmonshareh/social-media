import { EventData } from '@azure/event-hubs';

export interface IAzureServiceBusService {
  forwardEventsToServiceBusQueue(eventData: EventData): Promise<void>;
}
