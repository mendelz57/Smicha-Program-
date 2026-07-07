import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS city text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS state text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS zip text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS family_status text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS torah_education text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS shulchan_aruch_level text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS about_yourself text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS mothers_hebrew_name text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS fathers_hebrew_name text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reference_rabbi text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reference_phone text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS hear_about_us text`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_complete boolean NOT NULL DEFAULT false`;
  console.log('Migration complete!');
}

migrate().catch(console.error);
