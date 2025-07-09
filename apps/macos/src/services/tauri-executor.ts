import { invoke } from '@tauri-apps/api/core';
import { ExecutionResult, Language } from '@project/editor-core';

export class TauriExecutorService {
  async checkRuntime(runtime: 'python' | 'node'): Promise<boolean> {
    try {
      return await invoke<boolean>('check_runtime', { runtime });
    } catch (error) {
      console.error(`Failed to check ${runtime} runtime:`, error);
      return false;
    }
  }

  async executeCode(code: string, language: Language, stdin?: string): Promise<ExecutionResult> {
    try {
      if (language === 'html') {
        return {
          stdout: code,
          status: 'success',
          executionTime: 0,
        };
      }

      const result = await invoke<{
        stdout: string;
        stderr: string;
        status: string;
        code?: number;
      }>('execute_code', {
        code,
        language,
        stdin,
      });

      return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        status: result.status === 'success' ? 'success' : 'error',
      };
    } catch (error) {
      console.error('Tauri execution error:', error);
      return {
        stderr: `Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
      };
    }
  }
}