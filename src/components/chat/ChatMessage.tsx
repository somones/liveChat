import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Message } from '../../redux/slices/messagesSlice';
import Avatar from './Avatar';
import { formatTime } from '../../utils/dateUtils';
import { Check, CheckCheck } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isOwnMessage = currentUser?.uid === message.sender.uid;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isOwnMessage && (
        <div className="mr-2 flex-shrink-0">
          <Avatar 
            src={message.sender.photoURL} 
            name={message.sender.displayName}
            size="sm"
          />
        </div>
      )}
      
      <div className={`max-w-xs sm:max-w-md space-y-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && (
          <div className="text-xs text-gray-600 dark:text-gray-400 px-1">
            {message.sender.displayName}
          </div>
        )}
        
        <div className="flex items-end">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          </div>
        </div>
        
        <div className={`flex text-xs text-gray-500 dark:text-gray-400 px-1 ${isOwnMessage ? 'justify-end' : ''}`}>
          <span>{formatTime(message.createdAt)}</span>
          {isOwnMessage && (
            <span className="ml-1 flex items-center">
              {message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;