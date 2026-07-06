import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function seedAdmin() {
  const password = await bcrypt.hash('admin123', 10);
  await sql`
    INSERT INTO users (name, email, password, role, plan)
    VALUES ('Rabbi Admin', 'rabbimendel@chabadsola.com', ${password}, 'admin', 'monthly')
    ON CONFLICT (email) DO UPDATE SET role = 'admin'
  `;
  console.log('✅ Admin user created: rabbimendel@chabadsola.com / admin123');
  console.log('⚠️  Change this password after first login!');
}

seedAdmin().catch(console.error);
