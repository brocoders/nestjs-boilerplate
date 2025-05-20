[![LangChain & Milvus: Enhancing ChatGPT's Intelligence and Efficiency ...](https://tse2.mm.bing.net/th?id=OIP.I3J9yeXdUa15mqG4rFZ72gHaEA\&pid=Api)](https://zilliz.com/blog/enhancing-chatgpt-intelligence-efficiency-langchain-milvus)

Here's a comprehensive guide and API documentation for integrating Milvus with Node.js and LangChainJS. This guide is tailored for AI agents operating in offline environments, ensuring they have the necessary information without requiring internet access.

---

## 🧰 Prerequisites

* **Node.js**: Version 18 or higher.
* **Milvus**: Version 2.2 or higher.
* **Milvus Node.js SDK**: `@zilliz/milvus2-sdk-node`
* **LangChainJS**: For vector store integration.([Milvus][1], [Milvus][2], [Milvus][3])

---

## 📦 Installation

### 1. Install Milvus Node.js SDK

Use npm or yarn to install the Milvus SDK:

```bash
npm install @zilliz/milvus2-sdk-node
# or
yarn add @zilliz/milvus2-sdk-node
```



### 2. Install LangChainJS

Install LangChainJS for vector store integration:([GitHub][4])

```bash
npm install langchain
```



---

## 🔌 Connecting to Milvus

Establish a connection to your Milvus instance:([Milvus][5])

```javascript
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const client = new MilvusClient({
  address: 'localhost:19530', // Replace with your Milvus server address
  username: '',               // Optional
  password: '',               // Optional
});
```



Ensure that the Milvus server is running and accessible at the specified address.([Milvus][5])

---

## 🏗️ Creating a Collection

Define a schema and create a collection to store your vectors:([GitHub][6])

```javascript
const collectionName = 'example_collection';

await client.createCollection({
  collection_name: collectionName,
  fields: [
    {
      name: 'id',
      description: 'Unique identifier',
      data_type: DataType.Int64,
      is_primary_key: true,
      autoID: false,
    },
    {
      name: 'embedding',
      description: 'Vector representation',
      data_type: DataType.FloatVector,
      type_params: { dim: '1536' }, // Replace with your embedding dimension
    },
  ],
});
```



After creating the collection, you may need to load it before performing operations:([Milvus][2])

```javascript
await client.loadCollectionSync({ collection_name: collectionName });
```



---

## 📥 Inserting Data

Insert vector data into the collection:([Wikipedia][7])

```javascript
await client.insert({
  collection_name: collectionName,
  fields_data: [
    {
      id: 1,
      embedding: [0.1, 0.2, 0.3, ..., 0.1536], // Replace with your vector data
    },
    // Add more entries as needed
  ],
});
```



After insertion, flush the data to ensure it's persisted:

```javascript
await client.flushSync({ collection_names: [collectionName] });
```



---

## 🔍 Performing a Search

Execute a vector similarity search:([Milvus][2])

```javascript
const searchResults = await client.search({
  collection_name: collectionName,
  vectors: [[0.1, 0.2, 0.3, ..., 0.1536]], // Query vector
  search_params: {
    anns_field: 'embedding',
    topk: 5,
    metric_type: 'L2',
    params: JSON.stringify({ nprobe: 10 }),
  },
  output_fields: ['id'],
});
```



Ensure the collection is loaded before performing a search.([Milvus][2])

---

## 🔗 Integrating with LangChainJS

LangChainJS can be integrated with Milvus to manage vector stores.

### 1. Setting Up the Vector Store

```javascript
import { Milvus } from 'langchain/vectorstores/milvus';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

const embeddings = new OpenAIEmbeddings();

const vectorStore = new Milvus(embeddings, {
  collectionName: 'langchain_collection',
  connectionArgs: { uri: 'http://localhost:19530' }, // Replace with your Milvus URI
});
```



### 2. Adding Documents

```javascript
await vectorStore.addDocuments([
  { pageContent: 'Sample document content', metadata: { source: 'example' } },
  // Add more documents as needed
]);
```



### 3. Performing a Similarity Search

```javascript
const results = await vectorStore.similaritySearch('search query', 5);
```



This will return the top 5 documents similar to the search query.([Milvus][8])

---

## ⚠️ Common Issues and Solutions

* **SDK and Server Version Mismatch**: Ensure that the versions of the Milvus server and the Node.js SDK are compatible.&#x20;

* **Collection Not Loaded**: Before performing search operations, ensure that the collection is loaded using `loadCollectionSync`.

* **Embedding Dimension Mismatch**: The dimension of the vectors inserted must match the dimension specified in the collection schema.

---

## 📚 Additional Resources

* **Milvus Node.js SDK Documentation**: ([Milvus][9])

* **LangChainJS Milvus Integration Guide**: ([Langchain][10])

* **Milvus and LangChain RAG Tutorial**: ([Milvus][8])

---

This guide provides the essential steps and considerations for integrating Milvus with Node.js and LangChainJS. Ensure that all configurations match your specific setup and requirements.

[1]: https://milvus.io/docs/install-node.md?utm_source=chatgpt.com "Install Milvus Nodejs SDK"
[2]: https://milvus.io/api-reference/node/v2.2.x/Data/search.md?utm_source=chatgpt.com "search() - Milvus nodejs sdk v2.2.x/Data"
[3]: https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md?utm_source=chatgpt.com "Data Insertion and Data Persistence in a Vector Database - Milvus Blog"
[4]: https://github.com/langchain-ai/langchain-milvus?utm_source=chatgpt.com "️ LangChain Milvus - GitHub"
[5]: https://milvus.io/api-reference/node/v2.3.x/Client/MilvusClient.md?utm_source=chatgpt.com "MilvusClient() - Milvus nodejs sdk v2.3.x/Client"
[6]: https://github.com/milvus-io/milvus-sdk-node?utm_source=chatgpt.com "milvus-io/milvus-sdk-node: The Official Mivus node.js sdk(client)"
[7]: https://en.wikipedia.org/wiki/Milvus_%28vector_database%29?utm_source=chatgpt.com "Milvus (vector database)"
[8]: https://milvus.io/docs/integrate_with_langchain.md?utm_source=chatgpt.com "Retrieval-Augmented Generation (RAG) with Milvus and LangChain"
[9]: https://milvus.io/api-reference/node/v2.2.x/About.md?utm_source=chatgpt.com "About Milvus-sdk-node - Milvus nodejs sdk v2.2.x"
[10]: https://js.langchain.com/docs/integrations/vectorstores/milvus/?utm_source=chatgpt.com "Milvus - LangChain.js"
