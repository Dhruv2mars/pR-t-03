export interface CodeSession {
  id?: number;
  code: string;
  language: 'python' | 'javascript' | 'html';
  output?: string;
  timestamp: string;
}

export interface AppData {
  id?: number;
  key: string;
  value: string;
}

export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS code_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('python', 'javascript', 'html')),
    output TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS app_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_code_sessions_language_timestamp 
  ON code_sessions(language, timestamp DESC);

  CREATE INDEX IF NOT EXISTS idx_app_data_key 
  ON app_data(key);
`;