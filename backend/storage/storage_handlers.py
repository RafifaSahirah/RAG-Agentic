import json
import os
from datetime import datetime

STORAGE_FILE = "storage/chat_storage.json"

def load_storage_data():
    """Fungsi untuk membaca data dari file JSON"""
    if not os.path.exists(STORAGE_FILE):
        return {
            "files": [],
            "chat_sessions": {}
        }
    with open(STORAGE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_storage_data(data):
    """Fungsi untuk menulis/mengunci data kembali ke file JSON."""
    with open(STORAGE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def save_new_file_metadata(file_id: str, filename: str, file_hash: str):
    """Menyimpan entri metadata file baru ke dalam list 'files' di JSON."""
    data = load_storage_data()
    created_at = datetime.now().isoformat()
    
    new_entry = {
        "file_id": file_id,
        "filename": filename,
        "file_hash": file_hash,
        "created_at": created_at
    }

    data["files"].append(new_entry)
    if file_id not in data["chat_sessions"]:
        data["chat_sessions"][file_id] = []

    save_storage_data(data)

def save_chat_message(session_id: str, sender: str, text: str, steps: list = None):
    data = load_storage_data()

    if steps is None:
        steps = []

    timestamp = datetime.now().isoformat()

    new_messages = {
        "sender": sender,
        "text": text,
        "steps": steps,
        "timestamp": timestamp
    }

    if session_id not in data["chat_sessions"]:
        data["chat_sessions"][session_id] = []

    data["chat_sessions"][session_id].append(new_messages)

    save_storage_data(data)

def get_all_stored_files():
    """Fungsi untuk mengambil daftar files"""
    data = load_storage_data()
    return data["files"]

def get_chat_history(session_id):
    """Fungsi untuk mengambil chat history"""
    data = load_storage_data()
    return data["chat_sessions"].get(session_id, [])