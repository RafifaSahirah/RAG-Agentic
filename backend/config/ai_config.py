import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

load_dotenv()
gemini_key = os.getenv("GOOGLE_API_KEY")

# Model LLM
model = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    temperature=0,
    max_retries=6
)

# Model Embedding
# embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

# Vector DB initialization
vector_store = Chroma(
    collection_name="rag_documents",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db"
)