import { CodeSession, AppData, CREATE_TABLES_SQL } from './schema';

export interface DatabaseAdapter {
  run(sql: string, params?: any[]): void;
  get(sql: string, params?: any[]): any;
  all(sql: string, params?: any[]): any[];
}

export class DatabaseQueries {
  constructor(private db: DatabaseAdapter) {}

  initializeTables(): void {
    this.db.run(CREATE_TABLES_SQL);
  }

  saveCodeSession(session: Omit<CodeSession, 'id'>): number {
    const result = this.db.run(
      `INSERT INTO code_sessions (code, language, output, timestamp) 
       VALUES (?, ?, ?, ?)`,
      [session.code, session.language, session.output || null, session.timestamp]
    );
    return (result as any).lastInsertRowid || (result as any).lastID;
  }

  getLatestCodeSession(language: string): CodeSession | null {
    return this.db.get(
      `SELECT * FROM code_sessions 
       WHERE language = ? 
       ORDER BY timestamp DESC 
       LIMIT 1`,
      [language]
    );
  }

  getAllCodeSessions(language?: string): CodeSession[] {
    if (language) {
      return this.db.all(
        `SELECT * FROM code_sessions 
         WHERE language = ? 
         ORDER BY timestamp DESC`,
        [language]
      );
    }
    return this.db.all(
      `SELECT * FROM code_sessions 
       ORDER BY timestamp DESC`
    );
  }

  updateCodeSession(id: number, updates: Partial<CodeSession>): void {
    const fields = [];
    const values = [];
    
    if (updates.code !== undefined) {
      fields.push('code = ?');
      values.push(updates.code);
    }
    if (updates.output !== undefined) {
      fields.push('output = ?');
      values.push(updates.output);
    }
    if (updates.timestamp !== undefined) {
      fields.push('timestamp = ?');
      values.push(updates.timestamp);
    }
    
    if (fields.length > 0) {
      values.push(id);
      this.db.run(
        `UPDATE code_sessions SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  deleteCodeSession(id: number): void {
    this.db.run('DELETE FROM code_sessions WHERE id = ?', [id]);
  }

  setAppData(key: string, value: string): void {
    this.db.run(
      `INSERT OR REPLACE INTO app_data (key, value) VALUES (?, ?)`,
      [key, value]
    );
  }

  getAppData(key: string): string | null {
    const result = this.db.get(
      'SELECT value FROM app_data WHERE key = ?',
      [key]
    );
    return result ? result.value : null;
  }

  getAllAppData(): AppData[] {
    return this.db.all('SELECT * FROM app_data ORDER BY key');
  }

  deleteAppData(key: string): void {
    this.db.run('DELETE FROM app_data WHERE key = ?', [key]);
  }
}