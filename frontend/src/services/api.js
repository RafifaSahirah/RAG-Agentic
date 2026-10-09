const API_BASE_URL = 'http://localhost:8000';

export const uploadFile = async (selectedFile) => {
  const formData = new FormData();
  formData.append('file', selectedFile);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error("Gagal mengunggah file ke server.");
  }

  return response.json();
};

export const sendChatMessages = async (userPrompt, targetKey, currHistory) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agent`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: userPrompt,
        file_id: targetKey,
        chat_history: currHistory
      })
    });

    if (!response.ok) {
      return {
        answer: "Maaf, server mengalami gangguan internal.",
        steps: undefined
      };
    }

    return response.json();
  } catch (err) {
    return {
      answer: "Gagal terhubung ke server. Pastikan server FastAPI berjalan.",
      steps: undefined
    };
  }
};

export const fetchFiles = async () => {
  const response = await fetch(`${API_BASE_URL}/files`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data files.");
  }

  return response.json();
};
    
export const fetchChatHistory = async (currKey) => {
  const response = await fetch(`${API_BASE_URL}/chat/${currKey}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data chat.");
  }

  return response.json();
};