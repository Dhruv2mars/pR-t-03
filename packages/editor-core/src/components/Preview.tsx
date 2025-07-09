import React, { useRef, useEffect, useState } from 'react';
import { PreviewProps } from '../types';

export const Preview: React.FC<PreviewProps> = ({
  content,
  language,
  className = '',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (language === 'html' && iframeRef.current && content.trim()) {
      // Force iframe recreation for better isolation
      setIframeKey(prev => prev + 1);
      
      // Small delay to ensure iframe is recreated
      const timer = setTimeout(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        try {
          // Create a blob URL for better security isolation
          const blob = new Blob([content], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          
          // Set the iframe source to the blob URL
          iframe.src = url;
          
          // Clean up the blob URL after a delay
          const cleanupTimer = setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);

          // Store cleanup function
          iframe.dataset.cleanup = cleanupTimer.toString();
        } catch (error) {
          console.error('Error creating preview:', error);
          // Fallback to direct document writing with better isolation
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            doc.open();
            doc.documentElement.innerHTML = content;
            doc.close();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        // Clean up any existing blob URLs
        if (iframeRef.current?.dataset.cleanup) {
          clearTimeout(parseInt(iframeRef.current.dataset.cleanup));
        }
      };
    }
  }, [content, language, iframeKey]);

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
          key={iframeKey}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-scripts"
          title="HTML Preview"
        />
      </div>
    </div>
  );
};