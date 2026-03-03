const { ChatOllama } = require('@langchain/ollama');
const { OllamaEmbeddings } = require('@langchain/ollama');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

const model = new ChatOllama({
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "llama3",
  format: "json", // Requesting JSON format from Ollama
  temperature: 0,
});

const embeddings = new OllamaEmbeddings({
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "llama3",
});

let vectorStore = null;

exports.extractInfo = async (resumeText) => {
  const prompt = PromptTemplate.fromTemplate(`
    You are a professional resume parser. 
    Extract the following information from the resume text:
    Name, Email, Education, Years of Experience, Skills (as a list).
    
    Resume Text: {resumeText}
    
    Return the result strictly as a JSON object.
  `);

  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const response = await chain.invoke({ resumeText });
  
  try {
    return JSON.parse(response);
  } catch (e) {
    console.error('Failed to parse Ollama response as JSON', response);
    return null;
  }
};

exports.scoreCandidate = async (resumeText, role) => {
  const prompt = PromptTemplate.fromTemplate(`
    You are a senior hiring manager. 
    Evaluate the candidate for the following role:
    Role: {roleTitle}
    Requirements: {requiredSkills}
    Preferred: {preferredSkills}
    Experience Level: {experienceLevel}
    
    Resume Text: {resumeText}
    
    Scoring Weights: {weights}
    
    Provide your evaluation strictly as a JSON object with:
    1. "Overall Score" (0-100)
    2. "Summary of fit"
    3. "Strengths" (list)
    4. "Weaknesses" (list)
    5. "Fit Rating" (Excellent/Strong/Moderate/Weak)
  `);

  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const response = await chain.invoke({
    roleTitle: role.title,
    requiredSkills: role.requiredSkills.join(', '),
    preferredSkills: role.preferredSkills.join(', '),
    experienceLevel: role.experienceLevel,
    resumeText: resumeText,
    weights: JSON.stringify(role.weightConfig)
  });

  try {
    return JSON.parse(response);
  } catch (e) {
    console.error('Failed to parse Ollama scoring response as JSON', response);
    return null;
  }
};

exports.addCandidateToVectorStore = async (candidate) => {
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const docs = await textSplitter.createDocuments([candidate.resumeText], [{ id: candidate._id.toString(), name: candidate.name }]);
  
  if (!vectorStore) {
    vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  } else {
    await vectorStore.addDocuments(docs);
  }
};

exports.compareCandidates = async (role, candidates) => {
  const prompt = PromptTemplate.fromTemplate(`
    You are a professional recruiting analyst.
    Compare the following top candidates for the role: {roleTitle}
    
    Candidates:
    {candidatesInfo}
    
    Identify and return strictly as a JSON object:
    1. "Top 3 Differentiators" (list)
    2. "Common weaknesses among these candidates" (list)
    3. "Why the top candidate stands out" (string)
  `);

  const candidatesInfo = candidates.map(c => `Name: ${c.name}, Score: ${c.aiScore}, Summary: ${c.aiSummary}`).join('\n\n');

  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const response = await chain.invoke({
    roleTitle: role.title,
    candidatesInfo: candidatesInfo
  });

  try {
    return JSON.parse(response);
  } catch (e) {
    console.error('Failed to parse Ollama comparison response as JSON', response);
    return null;
  }
};
