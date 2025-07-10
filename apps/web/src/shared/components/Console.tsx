import React, { useState, useRef, useEffect } from 'react';
import { ConsoleProps, ConsoleMessage } from '../types';

export const Console: React.FC<ConsoleProps> = ({
  messages,
  onClear,
  onInput,
  isWaitingForInput,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isWaitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isWaitingForInput]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onInput(inputValue);
      setInputValue('');
    }
  };

  const getMessageStyle = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'input':
        return 'text-blue-400';
      default:
        return 'text-gray-300';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`flex flex-col h-full bg-gray-900 ${className}`}>
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-600">
        <span className="text-gray-300 text-sm font-medium">Console</span>
        <button
          onClick={onClear}
          className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="text-gray-500 italic">Console output will appear here...</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="mb-1 flex">
              <span className="text-gray-500 text-xs mr-2 flex-shrink-0 mt-0.5">
                {formatTimestamp(message.timestamp)}
              </span>
              <div className={`flex-1 ${getMessageStyle(message.type)}`}>
                {message.type === 'input' && <span className="text-blue-500">{'> '}</span>}
                <pre className="whitespace-pre-wrap break-words">{message.content}</pre>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {isWaitingForInput && (
        <form onSubmit={handleInputSubmit} className="p-2 bg-gray-800 border-t border-gray-600">
          <div className="flex items-center">
            <span className="text-blue-400 mr-2 font-mono">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter input..."
              className="flex-1 bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500 font-mono text-sm"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
};