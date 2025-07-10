import React, { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { EditorProps, Language } from '../types';

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML/CSS' },
];

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  html: 'html',
};

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  language,
  onLanguageChange,
  className = '',
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    monaco.editor.defineTheme('vs-dark-custom', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
      },
    });
    
    monaco.editor.setTheme('vs-dark-custom');
    
    editor.updateOptions({
      fontFamily: 'Fira Code, Consolas, Monaco, monospace',
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      renderWhitespace: 'selection',
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-600">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={MONACO_LANGUAGE_MAP[language]}
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          onMount={handleEditorDidMount}
          options={{
            theme: 'vs-dark-custom',
          }}
        />
      </div>
    </div>
  );
};