export type Language = 'python' | 'javascript' | 'html';

export interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  status: 'success' | 'error' | 'timeout';
  executionTime?: number;
}

export interface CodeExecutor {
  execute(code: string, language: Language, stdin?: string): Promise<ExecutionResult>;
}

export interface ConsoleMessage {
  id: string;
  type: 'output' | 'error' | 'input';
  content: string;
  timestamp: Date;
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

export interface ConsoleProps {
  messages: ConsoleMessage[];
  onClear: () => void;
  onInput: (input: string) => void;
  isWaitingForInput: boolean;
  className?: string;
}

export interface PreviewProps {
  content: string;
  language: Language;
  className?: string;
}

export interface ButtonsProps {
  onRun: () => void;
  onClear: () => void;
  isRunning: boolean;
  className?: string;
}