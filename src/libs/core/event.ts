export type AzureEventHubBody = {
  body: string;
  partitionKey?: string;
  properties: object;
};
