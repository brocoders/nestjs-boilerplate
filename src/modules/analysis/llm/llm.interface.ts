export interface Llm {
  invoke(input: string | Record<string, unknown>): Promise<string>;
}
