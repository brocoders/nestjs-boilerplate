export interface Llm {
  invoke(input: string | Record<string, unknown>): Promise<string>;
  streamInvoke?(input: string | Record<string, unknown>): AsyncIterable<string>;
}
