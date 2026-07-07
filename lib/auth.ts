import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;
        return { id: String(user.id), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        let dbUser = await db.query.users.findFirst({ where: eq(users.email, profile.email) });
        if (!dbUser) {
          const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          const inserted = await db.insert(users).values({
            name: (profile as any).name || profile.email,
            email: profile.email,
            role: 'student',
            plan: 'trial',
            trialEndsAt,
          }).returning();
          dbUser = inserted[0];
        }
        token.id = String(dbUser.id);
        token.role = dbUser.role;
      } else if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
  },
});
