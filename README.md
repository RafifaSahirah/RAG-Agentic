# 🤖 RAG-Agentic

> A question-answering web app based on uploaded PDF documents, built with a **RAG (Retrieval-Augmented Generation)** architecture and an **AI Agent** that selects tools automatically. It also supports general chat and simple calculations.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?logo=langchain&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6F00)
![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?logo=huggingface&logoColor=black)

---

## 📌 Overview

**RAG-Agentic** lets users upload a PDF document and ask questions directly about its contents. Answers are generated from context retrieved from the document (not just the model's general knowledge), making them more relevant and verifiable.

Unlike conventional RAG, which always performs retrieval, this project takes an **agentic** approach: the LLM decides on its own when to search the PDF, when to calculate, when to save notes, and when to simply respond as a regular chatbot.

## ✨ Key Features

- 📄 **PDF-based Q&A**: upload a document and ask questions about its contents.
- 💬 **General chat**: chat freely without a document.
- 🧠 **Agentic tool calling**: 
    - 🔍 **PDF Document Search**: autonomous vector search powered by ChromaDB to answer queries directly from uploaded PDFs.
    - 🧮 **Calculator**: Executes precise basic arithmetic (`tambah`, `kurang`, `kali`, `bagi`).
    - 📝 **Save notes**: save summaries or information to a `.txt` file on user request.
- 🌐 **Multilingual support**: a multilingual embedding model makes it suitable for documents in Indonesian and other languages.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Next.js, Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **AI Framework** | LangChain |
| **LLM** | `gemini-3.5-flash-lite` (Google) |
| **Embedding** | `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (Hugging Face) |
| **Vector Database** | ChromaDB |
| **History Storage** | JSON (local storage) |
| **Environment** | Python `venv` |

## 🧩 Custom Tools

The agent has three custom tools that are invoked automatically as needed:

| Tool | Function | Parameters |
|---|---|---|
| `search_pdf_document` | Searches for relevant information, material, or facts in the currently active PDF | `query` (2-4 keywords), `file_id` |
| `calculator` | Performs basic arithmetic with exact operation strings (`tambah`, `kurang`, `kali`, `bagi`) and zero-division handling | `a`, `b`, `operation` |
| `save_notes` | Saves a summary or notes to a `.txt` file when explicitly requested | `file_name`, `text` |

## 📁 Project Structure

```
RAG-Agentic/
├── backend/
│   ├── config/              # AI & LLM configuration
│   ├── services/            # Chat logic & core services
│   ├── storage/             # File storage, JSON database, & notes
│   ├── tools/               # Custom agent tools (PDF search, calculator, notes)
│   ├── utils/               # File hashing helpers
│   └── main.py              # FastAPI entry point
│
└── frontend/
    └── src/
        ├── app/             # Main page & Next.js layout
        ├── components/      # UI components (ChatWindow, Sidebar, Modal)
        ├── hooks/           # State management & chat logic
        └── services/        # API client for the backend
```

## 🚀 Installation & Running

### Prerequisites

- Python 3.10+
- Node.js 18+
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/<username>/RAG-Agentic.git
cd RAG-Agentic
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
GOOGLE_API_KEY=your_api_key_here
```

Start the server:

```bash
uvicorn main:app --reload
```

The backend runs at `http://localhost:8000` (auto-generated API docs at `/docs`).

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

### ⚡ Command Summary

| Part | Command |
|---|---|
| **Backend** | `cd backend` → `source venv/bin/activate` → `uvicorn main:app --reload` |
| **Frontend** | `cd frontend` → `npm run dev` |

## 💡 Usage Examples

| User Input | Tool Called |
|---|---|
| "What is in chapter 2 of this document?" | `search_pdf_document` |
| "Berapa 5 kali 2?" | `calculator` |
| "Save the previous summary to notes.txt" | `save_notes` |
| "Hi, explain what machine learning is" | No tool (general chat) |

## 🔮 Next Improvements

- Make calculator tool more flexible to handle both Indonesian and English keywords
- Migrate storage from JSON to a database (SQLite/PostgreSQL)
- Show source/page references in answers
- Streaming responses
- Docker deployment
