import initSqlJs from 'sql.js';
import { DatabaseQueries, WebDatabaseAdapter } from '@project/db-utils';

const DB_NAME = 'code-editor-db';

export class WebDatabaseService {
  private db: DatabaseQueries | null = null;
  private adapter: WebDatabaseAdapter | null = null;

  async initialize(): Promise<void> {
    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });

      const savedData = localStorage.getItem(DB_NAME);
      const buffer = savedData ? new Uint8Array(JSON.parse(savedData)) : undefined;

      this.adapter = new WebDatabaseAdapter(SQL, buffer);
      this.db = new DatabaseQueries(this.adapter);
      this.db.initializeTables();

      window.addEventListener('beforeunload', () => {
        this.saveToLocalStorage();
      });

      setInterval(() => {
        this.saveToLocalStorage();
      }, 30000);

    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private saveToLocalStorage(): void {
    if (this.adapter) {
      try {
        const data = this.adapter.export();
        localStorage.setItem(DB_NAME, JSON.stringify(Array.from(data)));
      } catch (error) {
        console.error('Failed to save database:', error);
      }
    }
  }

  getQueries(): DatabaseQueries {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  close(): void {
    if (this.adapter) {
      this.saveToLocalStorage();
      this.adapter.close();
    }
  }
}