import os

from langchain_core.tools import tool
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.ai_config import vector_store

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_docs(docs):
    for doc in docs:
        print("Source dokumen yang terambil:", doc.metadata.get("source"))
    return "\n\n".join(doc.page_content for doc in docs)

# ===== Search PDF Tool =====
@tool
def search_pdf_document(query: str, file_id: str) -> str:
    """Digunakan untuk mencari informasi, materi, konteks, atau fakta relevan dari dokumen PDF yang sedang diunggah pengguna.
    
    PENTING: Buat kata kunci 'query' yang singkat (2-4 kata) dan fokus pada inti topik utama.
    
    Args:
        query: Kata kunci atau frasa pencarian yang mencakup konteks utama pertanyaan.
        file_id: ID unik file dokumen PDF yang sedang aktif dibuka pengguna.
    """

    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 5,
            "filter": {"file_id": file_id}
        }
    )

    docs = retriever.invoke(query)

    if not docs:
        return "Tidak ditemukan konteks atau informasi yang relevan di dalam dokumen ini."

    formatted_docs = format_docs(docs)

    return formatted_docs

# ===== Calculator Tool =====
@tool
def calculator(a: float, b: float, operation: str):
    """Digunakan untuk melakukan perhitungan matematika yang akurat antara dua bilangan
    
    Args: 
        a (float): Bilangan pertama.
        b (float): Bilangan kedua.
        operasi (str): Jenis operasi matematika ('tambah', 'kurang', 'kali', 'bagi').

    Returns:
        float | str: Hasil perhitungan, atau pesan error jika pembagian dengan nol.
    """

    if (operation.lower() == "tambah"):
        return a + b
    elif (operation.lower() == "kurang"):
        return a - b
    elif (operation.lower() == "kali"):
        return a * b
    elif (operation.lower() == "bagi"):
        if (b == 0):
            return "Tidak bisa membagi dengan 0"
        return a / b

# ===== Save Notes Tool =====
@tool
def save_notes(file_name: str, text: str):
    """Digunakan ketika pengguna meminta secara eksplisit untuk menyimpan ringkasan, catatan, atau informasi ke dalam file dokumen teks (.txt). 
    
    Args:
        file_name: Nama file teks yang ingin dibuat atau ditulis (contoh: 'catatan.txt' atau 'ringkasan_materi').
        text: Isi teks lengkap atau catatan yang akan dimasukkan ke dalam file tersebut.
    """

    if not file_name.endswith(".txt"):
        file_name += ".txt"

    target_folder = "./storage/notes"
    os.makedirs(target_folder, exist_ok=True)

    path = os.path.join(target_folder, file_name)

    file_exist = os.path.exists(path)

    with open(path, "a", encoding="utf-8") as my_file:
        if file_exist:
            my_file.write("\n\n" + text)
            status_message = f"Berhasil menambahkan catatan baru ke dalam file yang sudah ada: storage/notes/{file_name}"
        else:
            my_file.write(text)
            status_message = f"Berhasil membuat file baru dan menyimpan catatan ke: storage/notes/{file_name}"

    return status_message