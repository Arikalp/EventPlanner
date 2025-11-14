/**
 * Conversation Interface Component
 * Handles AI-powered chat interactions for event planning
 */

import { useState, useRef, useEffect } from 'react';
import { useApplicationContext } from '../context/ApplicationContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import InputField from './InputField.jsx';
import { ConversationService } from '../services/ConversationService.js';

const ConversationInterface = () => {
  const [userInput, setUserInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const { isLoading, actions } = useApplicationContext();

  const conversationService = new ConversationService();

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessageSubmission = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setConversationHistory(prev => [...prev, userMessage]);
    setUserInput('');
    actions.setLoading(true);

    try {
      const response = await conversationService.sendMessage({
        message: userInput,
        conversationId: null
      });

      console.log('Backend response:', response);

      const aiResponse = {
        id: Date.now() + 1,
        content: response.reply || 'AI could not generate a response.',
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };

      setConversationHistory(prev => [...prev, aiResponse]);
      actions.addMessage(aiResponse);
    } catch (error) {
      console.error('Conversation error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Unable to process your request. Please try again.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setConversationHistory(prev => [...prev, errorMessage]);
      actions.setError('Failed to communicate with AI assistant');
    } finally {
      actions.setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleMessageSubmission();
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    actions.clearConversations();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl font-medium text-gray-900">
              Event Planner
            </h1>
          </div>
          <button
            onClick={clearConversation}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {conversationHistory.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Event Planning Assistant
              </h3>
              <p className="text-gray-500">
                Ask questions about planning your event
              </p>
            </div>
          )}
          
          {conversationHistory.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded p-3">
                <div className="text-gray-500 text-sm">Typing...</div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-300 p-4">
        <div className="max-w-4xl mx-auto">
          <InputField
            value={userInput}
            onChange={setUserInput}
            onSubmit={handleMessageSubmission}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationInterface;