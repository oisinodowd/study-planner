import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, User } from 'lucide-react';
import { getAIResponse } from '../../services/aiService';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface AICopilotModalProps {
  topicName: string;
  onClose: () => void;
}

export function AICopilotModal({ topicName, onClose }: AICopilotModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await getAIResponse(input, topicName);
    const aiMessage: Message = { sender: 'ai', text: aiResponseText };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 md:items-center">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col"
      >
        <header className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-terracotta-600" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-midnight-900">
                AI Study Copilot
              </h3>
              <p className="text-sm text-midnight-500 font-body">
                Ask about: <strong>{topicName}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </header>
        
        <main className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-terracotta-600" />
                </div>
              )}
              <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-sage-600 text-white rounded-br-none' : 'bg-midnight-100 text-midnight-800 rounded-bl-none'}`}>
                <p className="text-sm font-body whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-sage-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-terracotta-600" />
              </div>
              <div className="max-w-md p-3 rounded-2xl bg-midnight-100 text-midnight-800 rounded-bl-none">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-terracotta-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-terracotta-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-2 h-2 bg-terracotta-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-midnight-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="w-full px-4 py-3 bg-midnight-100 border border-transparent rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-12 h-12 bg-terracotta-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-terracotta-700 transition-colors disabled:bg-terracotta-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
