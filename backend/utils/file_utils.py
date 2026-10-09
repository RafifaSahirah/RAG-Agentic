import hashlib
from config.ai_config import vector_store

# ===== File Hashing Utility =====
def get_file_hash(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest();

def check_hash_in_db(file_hash):
    result_id = None
    
    if file_hash is None:
        return None

    existing_file = vector_store._collection.get(
        where={"file_hash": file_hash},
        limit=1
    )

    if len(existing_file['ids']) > 0:
        first_metadata = existing_file['metadatas'][0]
        if first_metadata:
            result_id = first_metadata.get('file_id')

    return result_id
