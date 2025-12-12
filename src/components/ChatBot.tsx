import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { Icons, INITIAL_MESSAGE_TEXT } from '../constants';
import { sendMessageStream } from '../services/gemini';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: INITIAL_MESSAGE_TEXT }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: botMessageId, role: 'model', text: "", isStreaming: true }
    ]);

    try {
      await sendMessageStream(userMessage.text, (text, sources) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: text, sources: sources || msg.sources } 
              : msg
          )
        );
      });
    } catch (error) {
       console.error(error);
    } finally {
      setIsLoading(false);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-8 sm:right-8">
      
      {isOpen && (
        <div 
          className={`
            mb-4 w-[90vw] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-300 origin-bottom-right
            ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
          `}
        >
        
          <div className="bg-(--primary-700) p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">AgriDatum Assistant</h3>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <Icons.Close />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-(--primary-700) text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }
                  `}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100/20">
                      <p className="text-xs font-semibold mb-1 opacity-80">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`
                              flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors
                              ${msg.role === 'user' 
                                ? 'bg-green-700 hover:bg-green-800 text-green-100' 
                                : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                              }
                            `}
                          >
                            <Icons.Link />
                            <span className="truncate max-w-[150px]">{source.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start mb-4">
                 <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-(--primary-500) rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-(--primary-500) rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-(--primary-500) rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 px-4 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about weather, prices..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`
                  p-2 rounded-full transition-all
                  ${!input.trim() || isLoading 
                    ? 'text-gray-300' 
                    : 'bg-(--primary-700) text-white hover:bg-green-700 shadow-md transform hover:scale-105'
                  }
                `}
              >
                <Icons.Send />
              </button>
            </div>
            <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">
                  AI can make mistakes. Please verify important info.
                </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300
          ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-(--primary-700) text-white animate-float'}
        `}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <Icons.Close /> : <Icons.Robot />}
        
        {!isOpen && messages.length <= 1 && (
          <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            Ask AgriDatum AI
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;