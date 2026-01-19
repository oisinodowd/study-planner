import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface AICopilotButtonProps {
  onClick: () => void;
}

export function AICopilotButton({ onClick }: AICopilotButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 w-16 h-16 bg-terracotta-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
      aria-label="Open AI Study Copilot"
    >
      <MessageSquare className="w-8 h-8" />
    </motion.button>
  );
}
