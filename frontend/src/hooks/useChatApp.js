import { useState, useEffect, useMemo } from "react";
import { fetchFiles, sendChatMessages, uploadFile, fetchChatHistory } from "@/services/api";

export function useChatApp() {
  const [activeFile, setActiveFile] = useState(null);
  const [isUploading, setUploading] = useState(false); 
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [chatSessions, setChatSessions] = useState({});
  const [inputQuestion, setInputQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitLoading, setIsInitLoading] = useState(true);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isExistingFile, setIsExistingFile] = useState(null);

  const activeMessages = useMemo(() => {
    const currKey = activeFile || 'global';
    return chatSessions[currKey] || [];
  }, [chatSessions, activeFile]);

  useEffect(() => {
    console.log("=== ISI CHAT SESSIONS SAAT INI ===");
    console.dir(chatSessions);
  }, [chatSessions]);

  // Handle File Upload
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploading(true);

    try {
      const file = await uploadFile(selectedFile);
      const cleanName = file.file_id.split('_').slice(1).join('_') || file.file_id;

      if (file.status === "success") {
        setActiveFile(file.file_id);

        setChatSessions(prev => ({
          ...prev,
          [file.file_id]: prev[file.file_id] || []
        }));

        setUploadedFiles(prev => {
          const exists = prev.some(item => item.id === file.file_id);
          if (exists) return prev;
          return [
            ...prev,
            { id: file.file_id, name: cleanName }
          ];
        });
      } else if (file.status === "duplicate") {
        setIsExistingFile({
          id: file.file_id,
          name: cleanName
        });

        setIsDuplicateModalOpen(true);
      }
    } catch (error) {
      console.error('Gagal memuat data', error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSelectFiles = (file_id) => {
    setActiveFile(file_id);
  };

  // Helper Update Chat History
  const updateChatHistory = (targetKey, newMessage) => {
    setChatSessions(prev => {
      const currFileMessages = prev[targetKey] || [];
      return {
        ...prev,
        [targetKey]: [...currFileMessages, newMessage]
      };
    });
  };

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputQuestion.trim()) return;

    const userPrompt = inputQuestion;
    const targetKey = activeFile ? activeFile : 'global';
    const currHistory = chatSessions[targetKey] || [];

    updateChatHistory(targetKey, {
      sender: "user",
      text: userPrompt
    })

    setInputQuestion("");
    setIsLoading(true);
    
    try {
      const data = await sendChatMessages(userPrompt, targetKey, currHistory);

      updateChatHistory(targetKey, {
        sender: "assistant",
        text: data.answer,
        steps: data.steps
      });
    } catch (err) {
      console.error("Error tidak terduga: ", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Fetch Data Files & Sessions
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const result = await fetchFiles();
        const dataFiles = result.files || [];

        if (Array.isArray(dataFiles)) {
          const cleanedData = dataFiles.map(file => {
            const cleanName = file.file_id.split('_').slice(1).join('_') || file.file_id;
            return {
              id: file.file_id,
              name: cleanName
            };
          });

          setUploadedFiles(cleanedData);

          const initialChatSessions = {};
          const serverSessionsList = result.sessions || [];

          serverSessionsList.forEach(sessionId => {
            initialChatSessions[sessionId] = [];
          });

          setChatSessions(initialChatSessions);
        }
      } catch (err) {
        console.error("Gagal memuat data awal:", err);
      } finally {
        setIsInitLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle Fetch Chat History
  useEffect(() => {
    const loadChatHistory = async () => {
      const currKey = activeFile || 'global';

      try {
        const historyData = await fetchChatHistory(currKey);
        setChatSessions(prev => {
          const localMessage = prev[currKey] || [];
          
          if (Array.isArray(historyData) && historyData.length > 0) {
            return {
              ...prev,
              [currKey]: historyData
            };
          }

          if (localMessage.length > 0) {
            return prev;
          }

          return {
            ...prev,
            [currKey]: []
          };
        });
      } catch (err) {
        console.error("Gagal mengambil riwayat chat per sesi: ", err); 
      }
    };
    
    loadChatHistory();
  }, [activeFile]);

  return {
    isDuplicateModalOpen,
    setIsDuplicateModalOpen,
    isExistingFile,
    setIsExistingFile,
    setChatSessions,
    handleFileUpload,
    isUploading,
    activeFile,
    setActiveFile,
    isInitLoading,
    chatSessions,
    uploadedFiles,
    handleSelectFiles,
    activeMessages,
    isLoading,
    handleSendMessage,
    inputQuestion,
    setInputQuestion
  };
}