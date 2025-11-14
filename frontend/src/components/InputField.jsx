/**
 * Input Field Component
 * Handles user message input with enhanced UX
 */

import { useState } from 'react';

const InputField = ({ 
  value, 
  onChange, 
  onSubmit, 
  onKeyPress, 
  disabled, 
  placeholder 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  const handleSubmitClick = () => {
    if (!disabled && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className={`flex items-end space-x-3 p-3 border rounded transition-colors ${
      isFocused ? 'border-gray-400 bg-white' : 'border-gray-300 bg-white'
    }`}>
      <div className="flex-1">
        <textarea
          value={value}
          onChange={handleInputChange}
          onKeyPress={onKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-500"
          style={{
            minHeight: '24px',
            maxHeight: '120px'
          }}
        />
      </div>
      
      <button
        onClick={handleSubmitClick}
        disabled={disabled || !value.trim()}
        className={`px-4 py-2 text-sm rounded transition-colors ${
          disabled || !value.trim()
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-800 hover:bg-gray-900 text-white'
        }`}
        title="Send message"
      >
        Send
      </button>
    </div>
  );
};

export default InputField;