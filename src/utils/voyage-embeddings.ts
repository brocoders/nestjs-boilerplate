import { AsyncCallerParams } from '@langchain/core/dist/utils/async_caller';
import { Embeddings } from '@langchain/core/embeddings';
import { VoyageAIClient } from 'voyageai';

interface VoyageEmbeddingsParams {
  apiKey: string;
  model?: string;
  inputType?: 'query' | 'document';
  truncation?: boolean;
  outputDimension?: number;
  outputDtype?: 'float' | 'int8';
  encodingFormat?: 'base64' | 'ubinary' | undefined;
}

export class CustomVoyageEmbeddings extends Embeddings {
  private client: VoyageAIClient;
  private model: string;
  private inputType?: 'query' | 'document';
  private truncation?: boolean;
  private outputDimension?: number;
  private outputDtype?: 'float' | 'int8';
  private encodingFormat?: unknown;

  constructor(fields: VoyageEmbeddingsParams) {
    super(fields as AsyncCallerParams);
    this.client = new VoyageAIClient({ apiKey: fields.apiKey });
    this.model = fields.model || 'voyage-law-2';
    this.inputType = fields.inputType;
    this.truncation = fields.truncation;
    this.outputDimension = fields.outputDimension;
    this.outputDtype = fields.outputDtype;
    this.encodingFormat = fields.encodingFormat;
  }

  async embedQuery(text: string): Promise<number[]> {
    const res = await this.client.embed({
      model: this.model,
      input: text,
      inputType: this.inputType,
      truncation: this.truncation,
      outputDimension: this.outputDimension,
      outputDtype: this.outputDtype,
      encodingFormat: this.encodingFormat as 'base64' | undefined,
    });
    const data = res.data?.[0]?.embedding;
    if (!data) {
      throw new Error('No data returned from Voyage AI');
    }
    return data;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const res = await this.client.embed({
      model: this.model,
      input: texts,
      inputType: this.inputType,
      truncation: this.truncation,
      outputDimension: this.outputDimension,
      outputDtype: this.outputDtype,
      encodingFormat: this.encodingFormat as 'base64' | undefined,
    });
    const data = res.data;
    if (!data) {
      throw new Error('No data returned from Voyage AI');
    }
    const embeddings = data.map((item) => item.embedding);
    if (!embeddings) {
      throw new Error('No embeddings returned from Voyage AI');
    }
    return embeddings as number[][];
  }
}
