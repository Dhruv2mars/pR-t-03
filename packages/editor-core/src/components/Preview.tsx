import React, { useRef, useEffect } from 'react';
import { PreviewProps } from '../types';

export const Preview: React.FC<PreviewProps> = ({
  content,
  language,
  className = '',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (language === 'html' && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(content);
        doc.close();
      }
    }
  }, [content, language]);

  if (language !== 'html') {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-900 ${className}`}>
        <div className="text-gray-500 text-center">
          <div className="text-lg mb-2">Preview</div>
          <div className="text-sm">HTML/CSS preview will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-gray-900 ${className}`}>
      <div className="flex items-center p-2 bg-gray-800 border-b border-gray-600">
        <span className="text-gray-300 text-sm font-medium">Preview</span>
      </div>
      
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin"
          title="HTML Preview"
        />
      </div>
    </div>
  );
};