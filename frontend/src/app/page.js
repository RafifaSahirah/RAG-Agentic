"use client";

import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import ModalDialog from "@/components/ModalDialog";
import { useChatApp } from "@/hooks/useChatApp";

export default function Home() {
  const { 
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
  } = useChatApp();

  // console.log("FILE EXIST", isExistingFile);

  return (
    <div className="flex flex-row h-screen w-full bg-gray-200">
      {/* Pop Up */}
      <ModalDialog 
        isDuplicateModalOpen={isDuplicateModalOpen}
        setActiveFile={setActiveFile}
        setIsDuplicateModalOpen={setIsDuplicateModalOpen}
        isExistingFile={isExistingFile}
        setIsExistingFile={setIsExistingFile}
        setChatSessions={setChatSessions}
      />

      {/* Left Sidebar */}
      <Sidebar 
        handleFileUpload={handleFileUpload}
        isUploading={isUploading}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        isInitLoading={isInitLoading}
        chatSessions={chatSessions}
        uploadedFiles={uploadedFiles}
        handleSelectFiles={handleSelectFiles}
      />

      {/* Right (Chat Space) */}
      <ChatWindow 
        activeMessages={activeMessages}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
        inputQuestion={inputQuestion}
        setInputQuestion={setInputQuestion}
      />
    </div>
  );
}
