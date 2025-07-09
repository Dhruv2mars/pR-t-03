import React from 'react';
import { ButtonsProps } from '../types';

export const Buttons: React.FC<ButtonsProps> = ({
  onRun,
  onClear,
  isRunning,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-600 ${className}`}>
      <button
        onClick={onRun}
        disabled={isRunning}
        className={`
          flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors
          ${isRunning 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-green-600 text-white hover:bg-green-700'
          }
        `}
      >
        {isRunning ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Running...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Run
          </>
        )}
      </button>
      
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Clear
      </button>
    </div>
  );
};