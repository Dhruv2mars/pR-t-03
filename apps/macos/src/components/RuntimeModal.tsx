import React from 'react';

interface RuntimeModalProps {
  isOpen: boolean;
  runtime: 'python' | 'node';
  onClose: () => void;
}

export const RuntimeModal: React.FC<RuntimeModalProps> = ({
  isOpen,
  runtime,
  onClose,
}) => {
  if (!isOpen) return null;

  const runtimeInfo = {
    python: {
      name: 'Python 3',
      url: 'https://www.python.org/downloads/',
      description: 'Python 3 is required to run Python code.',
    },
    node: {
      name: 'Node.js',
      url: 'https://nodejs.org/',
      description: 'Node.js is required to run JavaScript code.',
    },
  };

  const info = runtimeInfo[runtime];

  const handleDownload = () => {
    window.open(info.url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Runtime Required</h2>
        </div>
        
        <p className="text-gray-300 mb-4">
          {info.description}
        </p>
        
        <p className="text-gray-400 text-sm mb-6">
          Please install {info.name} to continue using this feature.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Download {info.name}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};