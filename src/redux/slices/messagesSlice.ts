import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  text: string;
  sender: {
    uid: string;
    displayName: string;
    photoURL: string;
  };
  createdAt: number;
  read: boolean;
}

interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  isLoading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessagesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setMessagesLoading, setMessages, addMessage, setMessagesError, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;