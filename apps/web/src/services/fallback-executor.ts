import { ExecutionResult, Language } from '@project/editor-core';

export class FallbackExecutorService {
  async executeCode(code: string, language: Language, _stdin?: string): Promise<ExecutionResult> {
    try {
      if (language === 'html') {
        return {
          stdout: code,
          status: 'success',
          executionTime: 0,
        };
      }

      if (language === 'javascript') {
        // Simple JavaScript execution in browser
        try {
          // Capture console.log output
          const logs: string[] = [];
          const originalLog = console.log;
          console.log = (...args) => {
            logs.push(args.map(arg => String(arg)).join(' '));
          };

          // Execute the code
          const func = new Function(code);
          func();

          // Restore console.log
          console.log = originalLog;

          return {
            stdout: logs.join('\n'),
            status: 'success',
            executionTime: 0,
          };
        } catch (error) {
          return {
            stderr: `JavaScript Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            status: 'error',
          };
        }
      }

      if (language === 'python') {
        return {
          stderr: 'Python execution requires Judge0 API. Please configure your API key.',
          status: 'error',
        };
      }

      return {
        stderr: `Language ${language} not supported in fallback mode`,
        status: 'error',
      };
    } catch (error) {
      return {
        stderr: `Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
      };
    }
  }
}