import { useState, useEffect, useCallback } from 'react';
import { Language, ConsoleMessage, useDebounce } from '@project/editor-core';
import { Judge0Service } from '../services/judge0';
import { FallbackExecutorService } from '../services/fallback-executor';
import { WebDatabaseService } from '../services/database';

export function useCodeEditor() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [pendingInput, setPendingInput] = useState<string>('');
  
  const debouncedCode = useDebounce(code, 500);
  
  const [judge0Service] = useState(() => new Judge0Service());
  const [fallbackService] = useState(() => new FallbackExecutorService());
  const [dbService] = useState(() => new WebDatabaseService());
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await dbService.initialize();
        setIsDbInitialized(true);
        
        const savedSession = dbService.getQueries().getLatestCodeSession(language);
        if (savedSession) {
          setCode(savedSession.code);
        } else {
          setDefaultCode(language);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDefaultCode(language);
      }
    };

    initializeDb();

    return () => {
      dbService.close();
    };
  }, []);

  useEffect(() => {
    if (isDbInitialized) {
      const savedSession = dbService.getQueries().getLatestCodeSession(language);
      if (savedSession) {
        setCode(savedSession.code);
      } else {
        setDefaultCode(language);
      }
    }
  }, [language, isDbInitialized]);

  useEffect(() => {
    if (isDbInitialized && debouncedCode) {
      try {
        dbService.getQueries().saveCodeSession({
          code: debouncedCode,
          language,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to save code session:', error);
      }
    }
  }, [debouncedCode, language, isDbInitialized]);

  const setDefaultCode = (lang: Language) => {
    const defaultCodes = {
      python: 'print("Hello, World!")\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")',
      javascript: 'console.log("Hello, World!");\nconst name = "World";\nconsole.log(`Hello, ${name}!`);',
      html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n    <style>\n        body { font-family: Arial, sans-serif; }\n        .container { text-align: center; margin-top: 50px; }\n    </style>\n</head>\n<body>\n    <div class="container">\n        <h1>Hello, World!</h1>\n        <p>This is a simple HTML page.</p>\n    </div>\n</body>\n</html>',
    };
    setCode(defaultCodes[lang]);
  };

  const addMessage = useCallback((type: ConsoleMessage['type'], content: string) => {
    const message: ConsoleMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setMessages([]);
    
    try {
      if (language === 'python' && code.includes('input(')) {
        setIsWaitingForInput(true);
        return;
      }

      let result = await judge0Service.executeCode(code, language, pendingInput);
      
      // If Judge0 fails, try fallback for JavaScript and HTML
      if (result.status === 'error' && (language === 'javascript' || language === 'html')) {
        result = await fallbackService.executeCode(code, language, pendingInput);
      }
      
      if (result.stdout) {
        addMessage('output', result.stdout);
      }
      
      if (result.stderr) {
        addMessage('error', result.stderr);
      }

      if (isDbInitialized) {
        try {
          const output = JSON.stringify({
            stdout: result.stdout,
            stderr: result.stderr,
            status: result.status,
            executionTime: result.executionTime,
          });
          
          dbService.getQueries().saveCodeSession({
            code,
            language,
            output,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Failed to save execution result:', error);
        }
      }
    } catch (error) {
      addMessage('error', `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
      setPendingInput('');
    }
  }, [code, language, pendingInput, isRunning, judge0Service, addMessage, isDbInitialized, dbService]);

  const handleInput = useCallback(async (input: string) => {
    addMessage('input', input);
    setIsWaitingForInput(false);
    setPendingInput(input);
    
    try {
      let result = await judge0Service.executeCode(code, language, input);
      
      // If Judge0 fails, try fallback for JavaScript and HTML
      if (result.status === 'error' && (language === 'javascript' || language === 'html')) {
        result = await fallbackService.executeCode(code, language, input);
      }
      
      if (result.stdout) {
        addMessage('output', result.stdout);
      }
      
      if (result.stderr) {
        addMessage('error', result.stderr);
      }
    } catch (error) {
      addMessage('error', `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, language, judge0Service, addMessage]);

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    setMessages([]);
  }, []);

  return {
    code,
    setCode,
    language,
    messages,
    isRunning,
    isWaitingForInput,
    handleRun,
    handleInput,
    handleClear,
    handleLanguageChange,
  };
}