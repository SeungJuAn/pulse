import { BetterSqliteDriver, UnderscoreNamingStrategy, defineConfig } from '@mikro-orm/better-sqlite';
import { entities } from './database.entities';

export default defineConfig({
  // 테스트일 땐 인메모리 DB, 아니면 파일 DB
  dbName: process.env.NODE_ENV === 'test' ? ':memory:' : 'pulse.sqlite',
  driver: BetterSqliteDriver,
  entities,
  namingStrategy: UnderscoreNamingStrategy,
  // 테스트가 아닐 때만 쿼리 로그 출력
  debug: process.env.NODE_ENV !== 'test',
});
