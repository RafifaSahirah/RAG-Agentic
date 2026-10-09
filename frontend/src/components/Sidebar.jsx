function Sidebar({
  handleFileUpload,
  isUploading,
  activeFile,
  setActiveFile,
  isInitLoading,
  chatSessions,
  uploadedFiles,
  handleSelectFiles,

}) {
  return (
    <div className="w-1/3 bg-slate-100">
      <h2 className="text-xl font-bold text-gray-800">ChatPDF Workspace</h2>

      {/* Upload Document */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Unggah Dokument Pdf:</label>
        <input 
          type="file" 
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* General Chat Button */}
      <button 
        onClick={() => setActiveFile('global')}
        className={`w-full text-left px-3 py-2 rounded ${
          activeFile === 'global' || !activeFile 
            ? 'bg-blue-500 text-white font-bold' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        General Chat
      </button>

      {/* List Files */}
      <div className="flex flex-col gap-2 p-3 bg-white rounded-md border border-gray-200">
        <h3 className="text-xs font-semibold text-blue-600 uppercase">Daftar File</h3>

        <ul>
          {isInitLoading ? (
            <li className="px-3 py-2 text-sm text-gray-500 animate-pulse">
              Memuat daftar dokumen...
            </li>
          ) : Object.keys(chatSessions).length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-500">
              Belum ada dokumen yang diunggah.
            </li>
          ) : (
            Object.keys(chatSessions).map((sessionId) => {
              const parts = sessionId.split('-session-');
              const originalFileId = parts[0];
              const isNewSession = sessionId.includes('-session-');

              let timeLabel = "";
              if (isNewSession && parts[1]) {
                const rawTimestamp = parseInt(parts[1], 10);
                if (!isNaN(rawTimestamp)) {
                  timeLabel = new Date(rawTimestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }
              }
              
              const fileData = uploadedFiles?.find(file => file.id === originalFileId);
              const fileName = fileData?.name || `Dokumen (${originalFileId})`;

              return (
                <li key={sessionId}>
                  <button
                    onClick={() => handleSelectFiles(sessionId)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors break-words ${
                      sessionId === activeFile
                        ? 'bg-blue-600 text-sm text-white font-medium shadow'
                        : 'bg-transparent text-sm text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {fileName} {isNewSession ? `(Sesi ${timeLabel})` : ''}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;