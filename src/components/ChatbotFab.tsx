import React from 'react';
import { Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatbotFab: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/chatbot')}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-105 transition-transform"
      aria-label="Open AI Chatbot"
      title="Ask UniWay"
    >
      <Bot className="w-6 h-6" />
    </button>
  );
};

export default ChatbotFab;
