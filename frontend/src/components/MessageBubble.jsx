/**
 * Message Bubble Component
 * Displays individual messages in the conversation
 */

const MessageBubble = ({ message }) => {
  const { content, sender, timestamp, isError } = message;

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getBubbleStyles = () => {
    if (isError) {
      return 'bg-red-100 border border-red-200 text-red-800';
    }
    
    switch (sender) {
      case 'user':
        return 'bg-blue-500 text-white ml-auto';
      case 'assistant':
        return 'bg-white border border-gray-200 text-gray-800';
      case 'system':
        return 'bg-gray-100 border border-gray-200 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlignment = () => {
    return sender === 'user' ? 'justify-end' : 'justify-start';
  };

  const getSenderLabel = () => {
    switch (sender) {
      case 'user':
        return 'You';
      case 'assistant':
        return 'Assistant';
      case 'system':
        return 'System';
      default:
        return 'Message';
    }
  };

  return (
    <div className={`flex ${getAlignment()}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${getBubbleStyles()}`}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">{getSenderLabel()}</span>
            <span className={`text-xs opacity-70 ${
              sender === 'user' ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatTimestamp(timestamp)}
            </span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;