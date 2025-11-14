/**
 * Message Bubble Component
 * Displays individual messages in the conversation
 */

const MessageBubble = ({ message }) => {
  const { content, sender, timestamp, isError } = message || {};

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  const getBubbleStyles = () => {
    if (isError) return 'bg-red-100 border border-red-200 text-red-800';

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

  const getAlignment = () => (sender === 'user' ? 'justify-end' : 'justify-start');

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

  const escapeHtml = (unsafe = '') => {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const markdownToHtml = (text) => {
    if (!text) return '';
    let html = escapeHtml(text);

    // Basic markdown-like transforms: bold, italics, headers
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Unordered lists (simple)
    html = html.replace(/(^|\n)\s*[-\*]\s+(.*)/g, '$1<li>$2</li>');
    // Wrap consecutive <li> blocks in <ul>
    html = html.replace(/(\s*<li>.*?<\/li>\s*)+/gs, (match) => `<ul>${match.replace(/\n/g, '')}</ul>`);

    // Line breaks
    html = html.replace(/\n/g, '<br/>');

    return html;
  };

  const renderedContent = markdownToHtml(content);

  return (
    <div className={`flex ${getAlignment()} items-start py-2`}> 
      {sender !== 'user' && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">AI</div>
        </div>
      )}

      <div className={`px-4 py-3 rounded-lg shadow-sm ${getBubbleStyles()} ${sender === 'user' ? 'max-w-xs' : 'max-w-2xl'}`}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">{getSenderLabel()}</span>
            <span className={`text-xs opacity-70 ${sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatTimestamp(timestamp)}
            </span>
          </div>

          {sender === 'user' ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderedContent }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;