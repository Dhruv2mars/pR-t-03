import { DatabaseAdapter } from './queries';

export class MacOSDatabaseAdapter implements DatabaseAdapter {
  private db: any;

  constructor(betterSqlite3: any, path: string) {
    this.db = betterSqlite3(path);
  }

  run(sql: string, params: any[] = []): any {
    return this.db.prepare(sql).run(params);
  }

  get(sql: string, params: any[] = []): any {
    return this.db.prepare(sql).get(params) || null;
  }

  all(sql: string, params: any[] = []): any[] {
    return this.db.prepare(sql).all(params);
  }

  close(): void {
    this.db.close();
  }
}