import uuid

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.agents import create_agent

from storage.storage_handlers import save_new_file_metadata
from config.ai_config import vector_store, model
from tools.agent_tools import calculator, save_notes, search_pdf_document
from storage.storage_handlers import load_storage_data, save_storage_data, save_chat_message

# ===== RAG Document Processing =====
def process_pdf_upload (destination: str, filename: str, file_hash: str):
    loader = PyPDFLoader(destination)
    docs = loader.load() 

    if not docs:
        return {"error": "Gagal: Teks dari PDF tidak dapat dibaca (kemungkinan file berupa gambar/scan)."}
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    split_docs = text_splitter.split_documents(docs)

    unique_file_id = f"{uuid.uuid4()}_{filename}"
    save_new_file_metadata(
        file_id=unique_file_id,
        filename=filename,
        file_hash=file_hash
    )

    for doc in split_docs:
        doc.metadata['file_id'] = unique_file_id
        doc.metadata['file_hash'] = file_hash 

    if split_docs:
        vector_store.add_documents(documents=split_docs)

    return {
        "status": "success",
        "filename": filename, 
        "file_id": unique_file_id,
        "total_pages": len(docs),
        "total_chunks": len(split_docs),
        "message": "File berhasil diproses dan disimpan ke VectorDB",
    }

# ===== AI Agent Execution Logic =====
def execute_agent_chat (query: str, file_id: str, chat_history: list):
    system_prompt = (
        "Kamu adalah AI Agent yang sangat hemat API call. "
        "Jika pengguna meminta untuk membaca/meringkas dokumen lalu menyimpannya ke file, "
        "JANGAN melakukan pemanggilan tool secara terpisah jika bisa sekaligus. "
        "Selesaikan seluruh alur tugas dalam maksimal 1-2 siklus pemanggilan tool."
    )

    tools = [calculator, save_notes, search_pdf_document]

    agent = create_agent(
        model=model,
        tools=tools
    )

    data = load_storage_data()

    if file_id and file_id not in data["chat_sessions"]:
        data["chat_sessions"][file_id] = []
        save_storage_data(data)

    user_prompt = query
    if file_id:
        clean_file_id = file_id.split('-session-')[0]
        user_prompt += f"\n\n[System Context: File PDF yang sedang aktif dibuka pengguna memiliki file_id='{clean_file_id}']"

    formatted_messages = [
        ("system", system_prompt)
    ]

    for message in chat_history:
        if message["sender"] == "user":
            role = "user"
        else:
            role = "assistant"
        
        content = message["text"]
        formatted_messages.append((role, content))

    formatted_messages.append(("user", user_prompt))

    print(formatted_messages)

    save_chat_message(
        session_id=file_id,
        sender="user",
        text=query
    )

    response = agent.invoke({
        "messages": formatted_messages
    })

    steps=[]
    for msg in response["messages"]:
        if hasattr(msg, 'tool_calls') and msg.tool_calls:
            for tool in msg.tool_calls:
                steps.append(f"Memanggil Tool: {tool['name']} dengan argumen {tool['args']}")

    raw_content = response["messages"][-1].content

    if isinstance(raw_content, list):
        final_answer = raw_content[0].get("text", "")
    else:
        final_answer = raw_content

    save_chat_message(
        session_id=file_id,
        sender="assistant",
        text=final_answer,
        steps=steps
    )

    return {
        "answer": final_answer,
        "steps": steps
    }


