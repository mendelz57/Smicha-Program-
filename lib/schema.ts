import { pgTable, serial, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['student', 'admin']);
export const planEnum = pgEnum('plan', ['trial', 'monthly', 'annual', 'expired']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  role: roleEnum('role').default('student').notNull(),
  plan: planEnum('plan').default('trial').notNull(),
  trialEndsAt: timestamp('trial_ends_at'),
  subscriptionId: text('subscription_id'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
});

export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  title: text('title').notNull(),
  order: integer('order').notNull(),
});

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').references(() => chapters.id).notNull(),
  title: text('title').notNull(),
  youtubeId: text('youtube_id').notNull(),
  pdfUrl: text('pdf_url'),
  order: integer('order').notNull(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  videoId: integer('video_id').references(() => videos.id).notNull(),
  text: text('text').notNull(),
  order: integer('order').notNull(),
});

export const questionOptions = pgTable('question_options', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  text: text('text').notNull(),
  isCorrect: boolean('is_correct').default(false).notNull(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const studentProgress = pgTable('student_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  videoId: integer('video_id').references(() => videos.id).notNull(),
  completed: boolean('completed').default(false).notNull(),
  score: integer('score'),
  attempts: integer('attempts').default(0).notNull(),
  completedAt: timestamp('completed_at'),
});
