import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ChatMessage from './ChatMessage';
import { Message } from '../../redux/slices/messagesSlice';

const MessageList: React.FC = () => {
  const { messages } = useSelector((state: RootState) => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Group messages by date for displaying date separators
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messageGroups.map(({ date, messages }) => (
        <div key={date}>
          <div className="flex justify-center mb-4">
            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
              {date === new Date().toLocaleDateString() ? 'Today' : date}
            </div>
          </div>
          
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      ))}
      
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p className="text-center max-w-md">
            No messages yet. Start the conversation!
          </p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;