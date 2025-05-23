export type VoyageConfig = {
  apiKey: string | undefined;
  model?: string;
  inputType?: 'query' | 'document';
  truncation?: boolean;
  outputDimension?: number;
  outputDtype?: 'float' | 'int8';
  encodingFormat?: 'base64' | 'ubinary';
};
