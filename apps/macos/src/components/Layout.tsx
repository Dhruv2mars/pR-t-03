import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [consoleHeight, setConsoleHeight] = useState(30);
  const [previewWidth, setPreviewWidth] = useState(50);
  const [isDraggingConsole, setIsDraggingConsole] = useState(false);
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);

  const handleConsoleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingConsole(true);

    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const newHeight = ((windowHeight - e.clientY) / windowHeight) * 100;
      setConsoleHeight(Math.max(20, Math.min(60, newHeight)));
    };

    const handleMouseUp = () => {
      setIsDraggingConsole(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handlePreviewResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingPreview(true);

    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = (e.target as HTMLElement).closest('.main-content')?.getBoundingClientRect();
      if (containerRect) {
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setPreviewWidth(Math.max(30, Math.min(70, newWidth)));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPreview(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="h-screen bg-vscode-bg text-vscode-text flex flex-col">
      <div className="flex-1 flex main-content">
        <div 
          className="flex flex-col border-r border-vscode-border"
          style={{ width: `${previewWidth}%` }}
        >
          <div 
            className="flex-1 border-b border-vscode-border"
            style={{ height: `${100 - consoleHeight}%` }}
          >
            {React.Children.toArray(children)[0]}
          </div>
          
          <div
            className="h-1 bg-vscode-border cursor-row-resize hover:bg-blue-500 transition-colors"
            onMouseDown={handleConsoleResize}
          />
          
          <div 
            className="bg-vscode-panel"
            style={{ height: `${consoleHeight}%` }}
          >
            {React.Children.toArray(children)[1]}
          </div>
        </div>
        
        <div
          className="w-1 bg-vscode-border cursor-col-resize hover:bg-blue-500 transition-colors"
          onMouseDown={handlePreviewResize}
        />
        
        <div 
          className="bg-vscode-panel"
          style={{ width: `${100 - previewWidth}%` }}
        >
          {React.Children.toArray(children)[2]}
        </div>
      </div>
      
      {(isDraggingConsole || isDraggingPreview) && (
        <div className="fixed inset-0 cursor-row-resize z-50" />
      )}
    </div>
  );
};