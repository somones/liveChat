import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setMessages, addMessage } from '../../redux/slices/messagesSlice';
import { getMessages, sendMessage } from '../../api/messages';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Users } from 'lucide-react';
import useSocket from '../../hooks/useSocket';

const ChatRoom: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { socket, isConnected, onlineUsers, typingUsers, emitTyping } = useSocket();
  
  // Load messages from Firestore
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await getMessages(20);
        dispatch(setMessages(messages));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    
    loadMessages();
  }, [dispatch]);
  
  const handleSendMessage = async (text: string) => {
    if (!currentUser) return;
    
    try {
      const messageData = {
        text,
        sender: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
      };
      
      // Save message to Firestore
      const newMessage = await sendMessage(messageData);
      
      // Emit message through socket
      if (socket && isConnected) {
        socket.emit('message', newMessage);
      }
      
      // Add message to Redux store
      dispatch(addMessage(newMessage));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  if (!currentUser) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Please log in to chat</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-8rem)] transition-colors duration-200">
      <div className="bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between transition-colors duration-200">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Public Chat Room</h2>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Users className="h-4 w-4 mr-1" />
          <span>{onlineUsers} online</span>
        </div>
      </div>
      
      <MessageList />
      
      {typingUsers.size > 0 && (
        <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
          {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
        </div>
      )}
      
      <MessageInput onSendMessage={handleSendMessage} onTyping={emitTyping} />
    </div>
  );
};

export default ChatRoom;