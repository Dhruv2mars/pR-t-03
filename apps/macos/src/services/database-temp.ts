import { DatabaseQueries } from '@project/db-utils';
import { CodeSession, AppData } from '@project/db-utils';

// Temporary localStorage-based database for macOS testing
class TempDatabaseAdapter {
  private storageKey = 'macos-code-editor-db';

  private getData(): { sessions: CodeSession[], appData: AppData[] } {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : { sessions: [], appData: [] };
  }

  private saveData(data: { sessions: CodeSession[], appData: AppData[] }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  run(sql: string, params: any[] = []): any {
    // Simple implementation for basic operations
    if (sql.includes('CREATE TABLE')) {
      return { lastInsertRowid: 1 };
    }
    
    if (sql.includes('INSERT INTO code_sessions')) {
      const data = this.getData();
      const newSession: CodeSession = {
        id: Date.now(),
        code: params[0],
        language: params[1] as any,
        output: params[2],
        timestamp: params[3],
      };
      data.sessions.push(newSession);
      this.saveData(data);
      return { lastInsertRowid: newSession.id };
    }
    
    if (sql.includes('INSERT OR REPLACE INTO app_data')) {
      const data = this.getData();
      const existingIndex = data.appData.findIndex(item => item.key === params[0]);
      const newItem: AppData = { id: Date.now(), key: params[0], value: params[1] };
      
      if (existingIndex >= 0) {
        data.appData[existingIndex] = newItem;
      } else {
        data.appData.push(newItem);
      }
      this.saveData(data);
      return { lastInsertRowid: newItem.id };
    }
    
    return {};
  }

  get(sql: string, params: any[] = []): any {
    const data = this.getData();
    
    if (sql.includes('SELECT * FROM code_sessions') && sql.includes('WHERE language = ?')) {
      const sessions = data.sessions
        .filter(s => s.language === params[0])
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return sessions[0] || null;
    }
    
    if (sql.includes('SELECT value FROM app_data WHERE key = ?')) {
      const item = data.appData.find(item => item.key === params[0]);
      return item ? { value: item.value } : null;
    }
    
    return null;
  }

  all(sql: string, params: any[] = []): any[] {
    const data = this.getData();
    
    if (sql.includes('SELECT * FROM code_sessions')) {
      if (params.length > 0) {
        return data.sessions
          .filter(s => s.language === params[0])
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      return data.sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    if (sql.includes('SELECT * FROM app_data')) {
      return data.appData.sort((a, b) => a.key.localeCompare(b.key));
    }
    
    return [];
  }
}

export class MacOSDatabaseService {
  private db: DatabaseQueries | null = null;
  private adapter: TempDatabaseAdapter | null = null;

  async initialize(): Promise<void> {
    try {
      this.adapter = new TempDatabaseAdapter();
      this.db = new DatabaseQueries(this.adapter as any);
      this.db.initializeTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  getQueries(): DatabaseQueries {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  close(): void {
    // No cleanup needed for localStorage
  }
}