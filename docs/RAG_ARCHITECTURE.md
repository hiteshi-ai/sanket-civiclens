# SANKET — RAG Civic Evidence Architecture

## 1. System Role & Strict Boundaries
The Civic Evidence Assistant ("Ask CivicLens") provides grounded evidence retrieval and plain-language explanation over verified municipal and regulatory knowledge.

### Critical Rule: RAG Does Not Calculate Scores
- **Deterministic Engine**: Calculates Civic Confidence, Civic Risk, Priority Aging, Recurrence, and Closure Match.
- **RAG Engine**: Explains why a score was calculated by retrieving the verified input records, municipal SLAs, and government policies.

Under no circumstances does an LLM pick a score or make an ungrounded assertion.

---

## 2. Ingestion & Provenance Pipeline
```
[Verified Official Document]
  (e.g., MCC Citizen Charter, Swachh Bharat SLA, LGD Gazette)
    |
    v
[Document Ingestion Worker]
    |
    v
[Validate Content & Calculate SHA-256 Hash]
    |
    v
[Chunking (500 tokens, 50 token overlap)]
    |
    v
[Embed Chunks (SBERT / MiniLM / TF-IDF Vector Space)]
    |
    v
[Vector Store with Metadata: source_id, authority, date, url, sector, category]
```

---

## 3. Grounded Retrieval & Answer Generation
1. **User Query**: e.g., *"What is the municipal resolution SLA for potholes in Sector 22?"*
2. **Context Filtering**: Filters chunks by sector, category, and authority.
3. **Similarity Search**: Calculates cosine similarity against knowledge vector embeddings.
4. **Guardrail Check**:
   - If `top_similarity < 0.35` or no relevant chunks found:
     $$\text{Response} = \text{"Could not find sufficient verified evidence to answer this inquiry."}$$
   - The system **never** invents an answer or speculates.
5. **Citations**: Every generated response includes a structured `citations` array with document title, authority, reference year, and official URL.
