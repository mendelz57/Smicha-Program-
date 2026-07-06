import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('Running migrations...');

  await sql`
    DO $$ BEGIN
      CREATE TYPE role AS ENUM ('student', 'admin');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `;

  await sql`
    DO $$ BEGIN
      CREATE TYPE plan AS ENUM ('trial', 'monthly', 'annual', 'expired');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      role role DEFAULT 'student' NOT NULL,
      plan plan DEFAULT 'trial' NOT NULL,
      trial_ends_at TIMESTAMP,
      subscription_id TEXT,
      subscription_ends_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subjects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      "order" INTEGER NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS chapters (
      id SERIAL PRIMARY KEY,
      subject_id INTEGER REFERENCES subjects(id) NOT NULL,
      title TEXT NOT NULL,
      "order" INTEGER NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      chapter_id INTEGER REFERENCES chapters(id) NOT NULL,
      title TEXT NOT NULL,
      youtube_id TEXT NOT NULL,
      "order" INTEGER NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      video_id INTEGER REFERENCES videos(id) NOT NULL,
      text TEXT NOT NULL,
      "order" INTEGER NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS question_options (
      id SERIAL PRIMARY KEY,
      question_id INTEGER REFERENCES questions(id) NOT NULL,
      text TEXT NOT NULL,
      is_correct BOOLEAN DEFAULT FALSE NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS student_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      video_id INTEGER REFERENCES videos(id) NOT NULL,
      completed BOOLEAN DEFAULT FALSE NOT NULL,
      score INTEGER,
      attempts INTEGER DEFAULT 0 NOT NULL,
      completed_at TIMESTAMP
    )
  `;

  // Seed the 4 subjects
  await sql`
    INSERT INTO subjects (name, "order") VALUES
      ('Basar Bechalav', 1),
      ('Taruvos', 2),
      ('Hagalas Kelim', 3),
      ('Shabbos', 4)
    ON CONFLICT DO NOTHING
  `;

  console.log('✅ Migration complete!');
}

migrate().catch(console.error);
