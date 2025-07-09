import { useState, useEffect, useCallback } from 'react';
import { Language, ConsoleMessage, useDebounce } from '@project/editor-core';
import { TauriExecutorService } from '../services/tauri-executor';
import { MacOSDatabaseService } from '../services/database-temp';

export function useMacOSCodeEditor() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [pendingInput, setPendingInput] = useState<string>('');
  const [showRuntimeModal, setShowRuntimeModal] = useState(false);
  const [missingRuntime, setMissingRuntime] = useState<'python' | 'node' | null>(null);
  
  const debouncedCode = useDebounce(code, 500);
  
  const [executorService] = useState(() => new TauriExecutorService());
  const [dbService] = useState(() => new MacOSDatabaseService());
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

  const checkRuntimeAvailability = async (lang: Language): Promise<boolean> => {
    if (lang === 'html') return true;
    
    const runtime = lang === 'python' ? 'python' : 'node';
    const isAvailable = await executorService.checkRuntime(runtime);
    
    if (!isAvailable) {
      setMissingRuntime(runtime);
      setShowRuntimeModal(true);
    }
    
    return isAvailable;
  };

  const handleRun = useCallback(async () => {
    if (isRunning) return;

    const runtimeAvailable = await checkRuntimeAvailability(language);
    if (!runtimeAvailable) return;

    setIsRunning(true);
    setMessages([]);
    
    try {
      if (language === 'python' && code.includes('input(')) {
        setIsWaitingForInput(true);
        return;
      }

      const result = await executorService.executeCode(code, language, pendingInput);
      
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
  }, [code, language, pendingInput, isRunning, executorService, addMessage, isDbInitialized, dbService]);

  const handleInput = useCallback(async (input: string) => {
    addMessage('input', input);
    setIsWaitingForInput(false);
    setPendingInput(input);
    
    try {
      const result = await executorService.executeCode(code, language, input);
      
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
  }, [code, language, executorService, addMessage]);

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    setMessages([]);
  }, []);

  const handleCloseRuntimeModal = useCallback(() => {
    setShowRuntimeModal(false);
    setMissingRuntime(null);
  }, []);

  return {
    code,
    setCode,
    language,
    messages,
    isRunning,
    isWaitingForInput,
    showRuntimeModal,
    missingRuntime,
    handleRun,
    handleInput,
    handleClear,
    handleLanguageChange,
    handleCloseRuntimeModal,
  };
}