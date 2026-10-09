function ModalDialog({
  isDuplicateModalOpen,
  setActiveFile,
  setIsDuplicateModalOpen,
  isExistingFile,
  setIsExistingFile,
  setChatSessions
}) {
  if (!isDuplicateModalOpen) return null;

  const handleOpenExisting = () => {
    if (!isExistingFile?.id) return;

    setActiveFile(isExistingFile.id);
    setIsDuplicateModalOpen(false);
  }

  const handleStartNewSession = () => {
    if (!isExistingFile?.id) return;

    const newSessionId = `${isExistingFile.id}-session-${Date.now()}`;
              
    setChatSessions(prev => ({
      ...prev,
      [newSessionId]: []
    }));
    
    setActiveFile(newSessionId);
    setIsDuplicateModalOpen(false);
  }

  const handleCancel = () => {
    setIsExistingFile(null);
    setIsDuplicateModalOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-20 backdrop-blur-sm transition-all">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full m-4 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          File ini sudah pernah diunggah sebelumnya. Apa yang ingin Anda lakukan?
        </h3>

        <div className="flex flex-col gap-2">
          <button 
            className="w-full text-center px-4 py-2.5 bg-blue-600 text-sm text-white font-medium rounded-md hover:bg-blue-700 transition shadow-sm"
            onClick={handleOpenExisting}
          >
            Buka Chat Sebelumnya
          </button>

          <button 
            className="w-full text-center px-4 py-2.5 bg-gray-100 text-sm text-gray-700 font-medium rounded-md hover:bg-gray-200 transition"
            onClick={handleStartNewSession}
          >
            Mulai Chat Baru
          </button>

          <button 
            className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline text-center block"
            onClick={handleCancel}
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDialog;