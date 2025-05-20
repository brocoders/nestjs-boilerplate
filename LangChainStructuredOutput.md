Here is a comprehensive guide to using LangChainJS for structured output, including detailed API documentation, practical usage examples, and common pitfalls to avoid.

---

## 📘 LangChainJS Structured Output: API Documentation & How-To Guide

### Overview

LangChainJS enables large language models (LLMs) to produce structured outputs conforming to predefined schemas. This is particularly useful when integrating LLM responses into applications that require consistent data formats, such as databases or APIs. The `.withStructuredOutput()` method simplifies this process by binding a schema to the model and parsing the output accordingly. ([Medium][1], [Langchain][2])

---

### 🔧 API Reference: `.withStructuredOutput()`

#### Method Signature

```typescript
model.withStructuredOutput(schema: ZodSchema, options?: {
  method?: "functionCalling" | "jsonMode";
  name?: string;
}): Runnable;
```



#### Parameters

* **`schema`**: A Zod schema defining the desired structure of the model's output.
* **`options.method`** (optional): Specifies the method to enforce structured output.

  * `"functionCalling"`: Utilizes the model's function calling capabilities.
  * `"jsonMode"`: Instructs the model to output JSON conforming to the schema.
* **`options.name`** (optional): A name for the structured output function, useful when using function calling.([Langchain][2], [Langchain][3], [Medium][1], [Stack Overflow][4])

#### Returns

A `Runnable` instance that, when invoked, returns the model's output parsed according to the provided schema.([Langchain][2])

---

### ✅ Supported Models

The `.withStructuredOutput()` method is compatible with models that support structured outputs, including:([Langchain][3])

* OpenAI's GPT-4 and GPT-4o
* Anthropic's Claude
* Google's Gemini
* MistralAI([Langchain][3])

Ensure that the selected model supports the chosen method (`functionCalling` or `jsonMode`). ([Stack Overflow][4])

---

### 🛠️ Usage Example

```typescript
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

// Define the schema
const ResponseSchema = z.object({
  answer: z.string().describe("The answer to the user's question"),
  followup_question: z.string().describe("A follow-up question the user could ask"),
});

// Initialize the model
const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
});

// Bind the schema to the model
const modelWithStructuredOutput = model.withStructuredOutput(ResponseSchema);

// Invoke the model
const response = await modelWithStructuredOutput.invoke("What is the powerhouse of the cell?");

console.log(response);
// Output:
// {
//   answer: "The powerhouse of the cell is the mitochondrion.",
//   followup_question: "How does the mitochondrion generate energy?"
// }
```





---

### 📚 Defining Schemas with Zod

Zod is a TypeScript-first schema declaration and validation library. Use it to define the expected structure of the model's output.([GitHub][5], [aiboosted.dev][6])

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().describe("The user's first name"),
  last_name: z.string().describe("The user's last name"),
});
```



For arrays of objects:([Stack Overflow][7])

```typescript
const UsersSchema = z.array(UserSchema);
```



This approach ensures that the model's output adheres to the specified structure.&#x20;

---

### ⚠️ Common Pitfalls and Gotchas

1. **System Messages Interference**: Including system messages in prompts can disrupt structured output parsing. It's advisable to test structured outputs without system messages to ensure proper parsing. ([GitHub][8])

2. **Silent Failures on Parsing**: If the model's output doesn't match the schema, parsing may fail silently, returning `undefined`. Implement error handling to catch and address such cases.([GitHub][8])

3. **Model Compatibility**: Not all models support both `functionCalling` and `jsonMode`. Verify the capabilities of your chosen model and select the appropriate method. ([Stack Overflow][4], [Langchain][3])

4. **Complex Schemas**: Models may struggle with deeply nested or highly complex schemas. Simplify schemas where possible to improve reliability.

---

### 🧪 Testing and Validation

Always validate the model's output against the schema to ensure correctness. Use Zod's parsing methods to handle validation:([GitHub][8])

```typescript
const parsed = ResponseSchema.safeParse(response);
if (!parsed.success) {
  // Handle validation errors
  console.error(parsed.error);
} else {
  // Use the validated data
  console.log(parsed.data);
}
```



This approach helps in catching discrepancies between expected and actual outputs.

---

### 📌 Summary

* Use `.withStructuredOutput()` to bind a schema to your model and enforce structured outputs.
* Define clear and concise schemas using Zod to guide the model's responses.
* Be aware of potential issues with system messages and model compatibility.
* Always validate the model's output to ensure it conforms to the expected structure.([Langchain][2], [aiboosted.dev][6], [GitHub][8])

By following this guide, you can effectively leverage LangChainJS to produce reliable, structured outputs from language models.

---

[1]: https://medium.com/%40docherty/mastering-structured-output-in-llms-choosing-the-right-model-for-json-output-with-langchain-be29fb6f6675?utm_source=chatgpt.com "Mastering Structured Output in LLMs 1: JSON output with LangChain"
[2]: https://js.langchain.com/docs/concepts/structured_outputs/?utm_source=chatgpt.com "Structured outputs - LangChain.js"
[3]: https://js.langchain.com/docs/how_to/structured_output/?utm_source=chatgpt.com "How to return structured data from a model - LangChain.js"
[4]: https://stackoverflow.com/questions/78528163/langchain-openai-with-structured-output-json-mode?utm_source=chatgpt.com "Langchain OpenAI .with_structured_output() JSON mode"
[5]: https://github.com/langchain-ai/langchainjs/discussions/6851?utm_source=chatgpt.com "What's the right langchain API for binding output parsing vs native ..."
[6]: https://www.aiboosted.dev/p/llm-chain-with-structured-json-output?utm_source=chatgpt.com "A basic LangChain.js chain with prompt template, structured JSON ..."
[7]: https://stackoverflow.com/questions/78571107/how-to-use-structured-output-parser-for-array-of-objects-in-langchain?utm_source=chatgpt.com "How to use structured output parser for array of objects in langchain"
[8]: https://github.com/langchain-ai/langchainjs/issues/7179?utm_source=chatgpt.com "Structured Output not working with system instruction in template"
