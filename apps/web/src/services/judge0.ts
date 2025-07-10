import axios from 'axios';
import { ExecutionResult, Language } from '../shared';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'demo-key';

const LANGUAGE_IDS: Record<Language, number> = {
  python: 71,
  javascript: 63,
  html: 63, // We'll handle HTML differently
};

// Interfaces for Judge0 API (kept for future use)
// interface Judge0Submission {
//   source_code: string;
//   language_id: number;
//   stdin?: string;
// }

// interface Judge0Result {
//   stdout?: string;
//   stderr?: string;
//   status: {
//     id: number;
//     description: string;
//   };
//   time?: string;
//   memory?: number;
// }

export class Judge0Service {
  async executeCode(code: string, language: Language, stdin?: string): Promise<ExecutionResult> {
    try {
      if (language === 'html') {
        return {
          stdout: code,
          status: 'success',
          executionTime: 0,
        };
      }

      // Check if API key is available
      if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'demo-key') {
        return {
          stderr: 'Judge0 API key not configured. Please add VITE_RAPIDAPI_KEY to your .env file.',
          status: 'error',
        };
      }

      const submission = {
        source_code: code,
        language_id: LANGUAGE_IDS[language],
        stdin: stdin || '',
        base64_encoded: false,
        wait: true,
      };

      console.log('Submitting to Judge0:', { language, language_id: LANGUAGE_IDS[language] });

      const response = await axios.post(
        `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
        submission,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log('Judge0 response:', response.data);

      const result = response.data;

      const executionResult: ExecutionResult = {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        status: result.status?.id === 3 ? 'success' : 'error',
        executionTime: result.time ? parseFloat(result.time) : undefined,
      };

      return executionResult;
    } catch (error: any) {
      console.error('Judge0 execution error:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        if (error.response.status === 403) {
          return {
            stderr: 'Judge0 API access denied. Please check your RapidAPI key and subscription.',
            status: 'error',
          };
        }
        
        if (error.response.status === 429) {
          return {
            stderr: 'Judge0 API rate limit exceeded. Please try again later.',
            status: 'error',
          };
        }
      }
      
      return {
        stderr: `Execution error: ${error.message || 'Unknown error'}`,
        status: 'error',
      };
    }
  }
}