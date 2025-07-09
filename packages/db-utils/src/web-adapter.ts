import { DatabaseAdapter } from './queries';

export class WebDatabaseAdapter implements DatabaseAdapter {
  private db: any;

  constructor(sqlJs: any, buffer?: ArrayBuffer) {
    this.db = new sqlJs.Database(buffer);
  }

  run(sql: string, params: any[] = []): any {
    return this.db.run(sql, params);
  }

  get(sql: string, params: any[] = []): any {
    const stmt = this.db.prepare(sql);
    const result = stmt.getAsObject(params);
    stmt.free();
    return Object.keys(result).length > 0 ? result : null;
  }

  all(sql: string, _params: any[] = []): any[] {
    const stmt = this.db.prepare(sql);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  export(): Uint8Array {
    return this.db.export();
  }

  close(): void {
    this.db.close();
  }
}