import axios from 'axios';
import { addDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message } from '../redux/slices/messagesSlice';

const API_URL = import.meta.env.VITE_API_URL;

export const sendMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
  try {
    // In a real app, this would be:
    // return await axios.post(`${API_URL}/messages`, message);
    
    const messageWithMetadata = {
      ...message,
      createdAt: Date.now(),
      read: false,
    };
    
    const docRef = await addDoc(collection(db, 'messages'), messageWithMetadata);
    return {
      id: docRef.id,
      ...messageWithMetadata,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (messageLimit = 20) => {
  try {
    // In a real app, this would be:
    // return await axios.get(`${API_URL}/messages?limit=${limit}`);
    
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(messageLimit)
    );
    
    const snapshot = await getDocs(messagesQuery);
    const messages: Message[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Message, 'id'>
    })).reverse();
    
    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};