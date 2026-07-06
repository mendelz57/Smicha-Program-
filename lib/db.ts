import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const url = process.env.DATABASE_URL?.startsWith('postgresql') || process.env.DATABASE_URL?.startsWith('postgres')
  ? process.env.DATABASE_URL
  : 'postgresql://user:pass@localhost/db';
const sql = neon(url);
export const db = drizzle(sql, { schema });
