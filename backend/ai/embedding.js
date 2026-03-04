/**
 * ai/embedding.js
 * -------------------------------------------------
 * Handles embedding generation and FAISS vector store
 * for resume chunks and job descriptions.
 * -------------------------------------------------
 */
const { OpenAIEmbeddings } = require('@langchain/openai');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { Document } = require('@langchain/core/documents');
const path = require('path');
const fs = require('fs');

const FAISS_DIR = path.join(__dirname, '..', 'data', 'faiss_store');

let embeddings = null;
let vectorStore = null;

/**
 * Initialise the OpenAI embeddings model (lazy singleton).
 */
function getEmbeddings() {
  if (!embeddings) {
    embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    });
  }
  return embeddings;
}

/**
 * Load or create the FAISS vector store.
 */
async function getVectorStore() {
  if (vectorStore) return vectorStore;

  const emb = getEmbeddings();

  if (fs.existsSync(path.join(FAISS_DIR, 'faiss.index'))) {
    vectorStore = await FaissStore.load(FAISS_DIR, emb);
  } else {
    // Initialise with an empty placeholder document
    fs.mkdirSync(FAISS_DIR, { recursive: true });
    const placeholder = new Document({
      pageContent: 'InternSieve initialisation document',
      metadata: { type: 'system' },
    });
    vectorStore = await FaissStore.fromDocuments([placeholder], emb);
    await vectorStore.save(FAISS_DIR);
  }

  return vectorStore;
}

/**
 * Chunk and embed resume text, tagged with applicant metadata.
 */
async function embedResume(applicantId, resumeText, roleId) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150,
  });

  const docs = await splitter.createDocuments(
    [resumeText],
    [
      {
        applicantId: applicantId.toString(),
        roleId: roleId.toString(),
        type: 'resume',
      },
    ]
  );

  const store = await getVectorStore();
  await store.addDocuments(docs);
  await store.save(FAISS_DIR);

  return docs.length;
}

/**
 * Chunk and embed a role / job description.
 */
async function embedRole(roleId, roleText) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 100,
  });

  const docs = await splitter.createDocuments(
    [roleText],
    [
      {
        roleId: roleId.toString(),
        type: 'role',
      },
    ]
  );

  const store = await getVectorStore();
  await store.addDocuments(docs);
  await store.save(FAISS_DIR);

  return docs.length;
}

/**
 * Similarity search across the store filtered to a particular role.
 */
async function similaritySearch(query, k = 5, filter = {}) {
  const store = await getVectorStore();
  const results = await store.similaritySearch(query, k);

  // FAISS does not support metadata filtering natively in langchain,
  // so we filter in-memory after retrieval.
  if (Object.keys(filter).length === 0) return results;

  return results.filter((doc) =>
    Object.entries(filter).every(([key, val]) => doc.metadata[key] === val)
  );
}

module.exports = {
  getEmbeddings,
  getVectorStore,
  embedResume,
  embedRole,
  similaritySearch,
};
