### Specification Document: AI-Powered Contract Review Module (Hybrid Embeddings + Neo4j Knowledge Graph)

---

## 1. Overview

This module adds AI-driven contract review capabilities to an existing CLM platform built with NestJS (backend) and Angular (frontend). The module uses a hybrid architecture:

- **Embeddings and LLMs** for semantic understanding, clause classification, risk scoring, and natural language Q&A.
- **Neo4j Knowledge Graph** to represent structured contract data, enable rule-based compliance checks, and contextualize LLM responses.


## 2. Key Features

- Clause identification and classification
- Contract risk scoring and explanation
- Compliance rule validation
- Clause/contract anomaly detection
- Natural language Q&A interface with contract constraints
- Integration with existing CLM backend via REST/gRPC


## 3. High-Level Architecture

```text
[NestJS Backend] --- [LLM/Embedding Engine] <--> [Neo4j DB] <--> [Existing Angular Frontend]
                               |                               
                         [Vector DB (optional)]
```


## 4. Neo4j Schema Design

### 4.1 Node Types

```plaintext
(:Contract {id, title, effectiveDate, terminationDate, contractType, fileUrl})
(:Party {id, name, type, address, contact})
(:Clause {id, title, clauseType, text, riskScore, confidence, chunkId})
(:Entity {id, name, type})
(:Obligation {id, type, amount, dueDate})
(:LawReference {id, jurisdiction, act, section})
```

### 4.2 Relationships

```plaintext
(:Contract)-[:HAS_PARTY]->(:Party)
(:Contract)-[:HAS_CLAUSE]->(:Clause)
(:Clause)-[:MENTIONS_ENTITY]->(:Entity)
(:Clause)-[:IMPOSES]->(:Obligation)
(:Clause)-[:REFERS_TO]->(:LawReference)
(:Clause)-[:SIMILAR_TO]->(:Clause) // semantic vector similarity > threshold
```


## 5. LLM-Powered Clause Extraction Prompt

```plaintext
"""
You are a contract analysis assistant. Given the full text of a legal contract, extract the following information:

1. A list of clauses with:
   - title
   - clauseType (e.g. Termination, Indemnity, Payment Terms, Governing Law, NDA)
   - full text of the clause
   - riskScore (Low, Medium, High)
   - justification for riskScore

2. For each clause, extract referenced parties, monetary amounts, important dates, legal references (acts/sections).

3. Output the result as JSON array of clause objects:
[
  {
    "title": "Termination Clause",
    "clauseType": "Termination",
    "text": "...",
    "riskScore": "Medium",
    "riskJustification": "Notice period less than 7 days",
    "entities": ["Acme Corp", "Vendor A"],
    "amounts": ["$10000"],
    "dates": ["2024-01-01"],
    "legalReferences": ["Indian Contract Act, Section 73"]
  },
  ...
]
"""
```


## 6. Backend (NestJS) Logic Modules

### 6.1 Module: Contract Ingestion

- Parse PDF/docx using `pdf-parse` or `mammoth`
- Chunk text (e.g. per section/heading)
- Call OpenAI/Claude/GPT-4o with prompt (see above)
- Save extracted structured data into Neo4j
- Save raw text + embeddings into vector store (e.g. Pinecone, Weaviate)

### 6.2 Module: Clause Search

- Accept query from frontend (e.g. "Find Termination clauses")
- Use Neo4j query to filter by `clauseType`
- Optionally refine using vector search for semantic match

### 6.3 Module: Risk Dashboard

- Aggregate clauses by `riskScore`
- For each contract, count high-risk clauses
- API to fetch top 5 high-risk clauses with explanation

### 6.4 Module: Compliance Rules Engine

- Each compliance rule is a Cypher query
- Example Rule:
```cypher
MATCH (c:Contract)-[:HAS_CLAUSE]->(cl:Clause)
WHERE cl.clauseType = 'Governing Law'
WITH c, COUNT(cl) as hasGL
WHERE hasGL = 0
RETURN c.title as nonCompliantContracts
```

### 6.5 Module: Semantic Q&A

- Accept natural language question (e.g. "What is the notice period in Vendor A's contract?")
- Retrieve context using Neo4j (get clauses from Contract where party.name = 'Vendor A')
- Feed to LLM with specific prompt for focused QA

### 6.6 Module: Anomaly Detection

- Run batch graph algorithms (optional: Neo4j GDS)
- Compare number of clauses per contract
- Detect contracts missing required clauseType
- Use embeddings to find outlier clauses


## 7. Frontend Integration

- Display clause list with clauseType, riskScore, text
- Highlight risk justification on hover or side panel
- Use graph-backed filters: by contract type, party, missing clause
- Embed semantic Q&A chatbox with constraint: contract ID or party ID


## 8. DevOps & Data Flow Considerations

- LLM requests via secure API (e.g. Azure OpenAI/GPT-4o)
- Neo4j can be hosted in AuraDB or self-managed Docker
- Use cron job to re-validate compliance rules weekly
- Logging for all AI decisions stored in audit log table


## 9. Vector Store (Optional)

- Store clause embeddings for fast semantic search
- Add `embedding` property on (:Clause)
- Tools: FAISS, Pinecone, Weaviate, Redis Vector


## 10. Sample Cypher Queries

### Get all high-risk clauses in a contract
```cypher
MATCH (c:Contract {id: $contractId})-[:HAS_CLAUSE]->(cl:Clause)
WHERE cl.riskScore = 'High'
RETURN cl.title, cl.text, cl.riskScore
```

### Get contracts missing NDA clause
```cypher
MATCH (c:Contract)
WHERE NOT (c)-[:HAS_CLAUSE]->(:Clause {clauseType: 'NDA'})
RETURN c.id, c.title
```

---


## 🔧 Updated Architecture Overview

Integrating domain-specific legal embeddings with a vector database and a knowledge graph enhances the contract review module's capabilities.

**Components:**

* **Frontend:** Angular (existing)
* **Backend:** NestJS (existing)
* **LLM Framework:** LangChain
* **Embedding Model:** Voyage Law-2
* **Vector Store:** Milvus
* **Knowledge Graph:** Neo4j([Milvus][3], [Latent.space][4], [Webkul Software][5], [arXiv][6])

---

## 🧠 Embedding Model: Voyage Law-2

Voyage Law-2 is optimized for legal retrieval tasks, offering superior performance on legal datasets. ([webvar.com][7])

**Key Features:**

* **Context Length:** 16,000 tokens
* **Embedding Dimension:** 1,024
* **Performance:** Outperforms other models on legal retrieval benchmarks([docs.aimlapi.com][8], [Voyage AI][9])

---

## 🗃️ Vector Store: Milvus Integration

Milvus is a high-performance vector database suitable for storing and querying large-scale embeddings. ([LangChain][10])

**Integration Steps:**

1. **Install Dependencies:**

   ```bash
   pip install langchain-milvus pymilvus
   ```



2. **Initialize Milvus Vector Store:**

   ```python
   from langchain_milvus import Milvus
   from voyageai import VoyageEmbeddings

   # Initialize embedding model
   voyage = VoyageEmbeddings(model="voyage-law-2", api_key="YOUR_API_KEY")

   # Initialize Milvus vector store
   vector_store = Milvus(
       embedding_function=voyage,
       connection_args={"host": "localhost", "port": "19530"},
   )
   ```



3. **Store Embeddings:**

   ```python
   from langchain_core.documents import Document

   documents = [Document(page_content="Clause text here.")]
   vector_store.add_documents(documents)
   ```



---

## 🗂️ Neo4j Knowledge Graph Schema

The knowledge graph captures structured information from contracts.([Harvey][11])

**Nodes:**

* **Contract:** id, title, effectiveDate, terminationDate, contractType
* **Party:** id, name, type, address, contact
* **Clause:** id, title, clauseType, text, riskScore, confidence
* **Entity:** id, name, type
* **Obligation:** id, type, amount, dueDate
* **LawReference:** id, jurisdiction, act, section

**Relationships:**

* (Contract)-\[:HAS_PARTY]->(Party)
* (Contract)-\[:HAS_CLAUSE]->(Clause)
* (Clause)-\[:MENTIONS_ENTITY]->(Entity)
* (Clause)-\[:IMPOSES]->(Obligation)
* (Clause)-\[:REFERS_TO]->(LawReference)
* (Clause)-\[:SIMILAR_TO]->(Clause)

---

## 🔄 Workflow Integration

1. **Contract Ingestion:**

   * Parse contract documents (PDF/DOCX).
   * Extract clauses and metadata using LLMs.
   * Generate embeddings with Voyage Law-2.
   * Store embeddings in Milvus and structured data in Neo4j.([Voyage AI][12], [Pinecone][13], [GitHub][14])

2. **Clause Retrieval:**

   * For semantic search, query Milvus with user input.
   * Retrieve top-k similar clauses.
   * Fetch detailed information from Neo4j using clause IDs.

3. **Risk Analysis:**

   * Analyze clauses for risk factors using predefined rules.
   * Update risk scores in Neo4j.
   * Visualize risk distribution in the frontend.

---

## 🧪 Sample Cypher Queries

**Retrieve High-Risk Clauses:**

```cypher
MATCH (c:Contract)-[:HAS_CLAUSE]->(cl:Clause)
WHERE cl.riskScore = 'High'
RETURN c.title, cl.title, cl.text
```



**Find Contracts Missing NDA Clause:**

```cypher
MATCH (c:Contract)
WHERE NOT (c)-[:HAS_CLAUSE]->(:Clause {clauseType: 'NDA'})
RETURN c.title
```

---

## 🚀 Deployment Considerations

* **Milvus:** Deploy as a standalone service or use Zilliz Cloud for managed hosting.
* **Neo4j:** Host on-premises or use Neo4j Aura for cloud deployment.
* **LangChain:** Ensure compatibility with NestJS backend.
* **Security:** Implement authentication and authorization for data access.([Milvus][18], [Webkul Software][5], [Wikipedia][19])

---

If you need further assistance with implementation details or code samples, feel free to ask!

[1]: https://docs.pinecone.io/models/voyage-law-2?utm_source=chatgpt.com "voyage-law-2 - Pinecone Docs"
[2]: https://arxiv.org/abs/2304.11370?utm_source=chatgpt.com "SAILER: Structure-aware Pre-trained Language Model for Legal Case Retrieval"
[3]: https://milvus.io/docs/basic_usage_langchain.md?utm_source=chatgpt.com "Use Milvus as a LangChain Vector Store"
[4]: https://www.latent.space/p/langchain?utm_source=chatgpt.com "The Point of LangChain — with Harrison Chase of LangChain"
[5]: https://webkul.com/blog/langchain-for-ecommerce/?utm_source=chatgpt.com "LangChain for Ecommerce | Build E-commerce AI Chatbot"
[6]: https://arxiv.org/abs/2209.06049?utm_source=chatgpt.com "Pre-trained Language Models for the Legal Domain: A Case Study on Indian Law"
[7]: https://webvar.com/marketplace/products/voyage-law-2-embedding-model/prodview-bknagyko2vl7a?utm_source=chatgpt.com "voyage-law-2 Embedding Model - Webvar"
[8]: https://docs.aimlapi.com/api-references/embedding-models/anthropic/voyage-law-2?utm_source=chatgpt.com "voyage-law-2 - AI/ML API Documentation"
[9]: https://docs.voyageai.com/docs/embeddings?utm_source=chatgpt.com "Text Embeddings - Introduction - Voyage AI"
[10]: https://python.langchain.com/docs/integrations/vectorstores/milvus/?utm_source=chatgpt.com "Milvus - ️ LangChain"
[11]: https://www.harvey.ai/blog/harvey-partners-with-voyage-to-build-custom-legal-embeddings?utm_source=chatgpt.com "Harvey partners with Voyage to build custom legal embeddings"
[12]: https://blog.voyageai.com/?utm_source=chatgpt.com "Voyage AI"
[13]: https://www.pinecone.io/learn/legal-semantic-search/?utm_source=chatgpt.com "Accelerating Legal Discovery and Analysis with Pinecone and ..."
[14]: https://github.com/langchain-ai/langchain-milvus?utm_source=chatgpt.com "️ LangChain Milvus - GitHub"
[15]: https://python.langchain.com/docs/integrations/providers/milvus/?utm_source=chatgpt.com "Milvus - ️ LangChain"
[16]: https://milvus.io/docs/full_text_search_with_langchain.md?utm_source=chatgpt.com "Using Full-Text Search with LangChain and Milvus"
[17]: https://medium.com/towards-agi/how-to-use-milvus-as-a-vector-database-in-langchain-guide-f06877ddde99?utm_source=chatgpt.com "How to Use Milvus as a Vector Database in LangChain Guide"
[18]: https://milvus.io/blog/2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md?utm_source=chatgpt.com "Manage Your Milvus Vector Database with One-click Simplicity - Milvus Blog"
[19]: https://en.wikipedia.org/wiki/FAISS?utm_source=chatgpt.com "FAISS"

