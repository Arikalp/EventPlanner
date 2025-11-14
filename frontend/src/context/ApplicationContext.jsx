/**
 * Application Context Provider
 * Manages global state for the event planning application
 */

import { createContext, useContext, useReducer } from 'react';

const ApplicationContext = createContext();

const initialState = {
  conversations: [],
  currentSession: null,
  isLoading: false,
  error: null,
  user: {
    preferences: {},
    sessionId: null
  }
};

const applicationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
        error: null
      };
    case 'CLEAR_CONVERSATIONS':
      return { ...state, conversations: [] };
    case 'SET_SESSION':
      return { ...state, currentSession: action.payload };
    default:
      return state;
  }
};

export const ApplicationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(applicationReducer, initialState);

  const contextValue = {
    ...state,
    dispatch,
    actions: {
      setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
      setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
      addMessage: (message) => dispatch({ type: 'ADD_MESSAGE', payload: message }),
      clearConversations: () => dispatch({ type: 'CLEAR_CONVERSATIONS' }),
      setSession: (session) => dispatch({ type: 'SET_SESSION', payload: session })
    }
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationContext must be used within ApplicationProvider');
  }
  return context;
};