import os

from typing import List, Dict, Any, Optional
from utils.file_utils import get_file_hash, check_hash_in_db
from storage.storage_handlers import load_storage_data, get_chat_history
from services.chat_service import process_pdf_upload, execute_agent_chat

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====== AGENT REQUEST SCHEMA ======
class AgentRequest(BaseModel):
    query: str
    file_id: Optional[str] = None
    chat_history: List[Dict[str, Any]] = []

# ====== UPLOAD PDF ENDPOINT ======
@app.post("/upload")
async def create_upload_file(file: UploadFile = File(...)):
    os.makedirs("./storage/temp", exist_ok=True)
    destination = f"./storage/temp/{file.filename}"

    try:
        contents = await file.read()
        file_hash = get_file_hash(contents)
        existing_file_id = check_hash_in_db(file_hash)

        if existing_file_id:
            return {
                "status": "duplicate",
                "message": "File sudah pernah diunggah",
                "file_id": existing_file_id
            }

        with open(destination, "wb") as f:
            f.write(contents)

        result = process_pdf_upload(destination, file.filename, file_hash)

        return result

    except Exception as e:
        return {"error": f"Terjadi kesalahan saat memproses file: {str(e)}"}

    finally:
        if os.path.exists(destination):
            os.remove(destination)

# ====== AGENT CHAT ENDPOINT ======
@app.post("/agent")
async def ask_question_with_tools(request: AgentRequest):
    result = execute_agent_chat (
        query=request.query,
        file_id=request.file_id,
        chat_history=request.chat_history
    )

    return result

# ======= GET FILES ENDPOINT ========
@app.get("/files")
async def get_all_files():
    data = load_storage_data()
    all_key_sessions = list(data.get("chat_sessions", {}).keys())
    
    return {
        "files": data.get("files", []),
        "sessions": all_key_sessions
    }

# ======= GET CHAT HISTORY ENDPOINT =======
@app.get("/chat/{file_id}")
async def get_chat_history_endpoint(file_id: str):
    chat_history = get_chat_history(file_id)
    
    return chat_history


