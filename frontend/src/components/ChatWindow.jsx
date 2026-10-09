import { useRef, useEffect } from "react";

function ChatWindow({
  activeMessages,
  isLoading,
  handleSendMessage,
  inputQuestion,
  setInputQuestion,
}) {
  const lastChatRef = useRef(null);

  useEffect(() => {
    if (lastChatRef.current) {
      lastChatRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [activeMessages]);

  return (
    <div className="w-2/3 flex flex-col gap-2">
      <div>
        <h2 className="text-xl p-3 font-semibold text-gray-800">Ruang Obrolan</h2>
        <p className="text-xs pl-3">Status</p>
      </div>

      {/* Area Message (Chat Feed) */}
      <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-3">
        {activeMessages?.map((msg, index) => (
          <div 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            key={index}
          >
            <div className={`max-w-[75%] rounded-2xl p-3 ${msg.sender === 'user' ? 'bg-gray-400 text-white' : 'bg-blue-400 text-white'}`}>
              {/* Agent Activity Log */}
              {msg.steps && msg.steps.length > 0 && (
                <div className="mb-2 p-2.5 bg-gray-100 rounded-xl text-xs font-mono text-gray-800 border border-gray-300">
                  <p className="font-bold mb-1 text-gray-900">Agent Activity Log:</p>
                  {msg.steps.map((step, idx) => (
                    <div key={idx}>- {step}</div>
                  ))}
                </div>
              )}

              {/* Replied Message (Assistant) */}
              <p>{ typeof msg.text === 'object' ? (msg.text[0]?.text || '') : msg.text}</p>
            </div>
          </div>
        ))}

        {/* Loading Status */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl p-3 bg-blue-600/70 text-white animate-pulse">
              <p>AI sedang berpikir...</p>
            </div>
          </div>
        )}
        
        <div ref={lastChatRef}/>
      </div>

      {/* Area Input Form */}
      <form onSubmit={handleSendMessage} className="flex flex-row gap-2 p-3">
        <input 
          type="text"
          placeholder="Tanyakan tentang dokumen..." 
          value={inputQuestion}   
          onChange={(e) => setInputQuestion(e.target.value)}
          className="w-5/6 rounded-2xl p-3 bg-white text-black"
        />
        
        <button 
          className="w-1/6 rounded-2xl bg-blue-500 text-white" 
          disabled={isLoading || !inputQuestion.trim()}
          type="submit"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;