import { getDb } from '../client';
import { users } from './users';
import { hashPassword } from '../../lib/auth/password';

async function seedAdmin() {
  const db = getDb();
  const hashedPassword = await hashPassword('mphm1234');
  
  await db.insert(users).values({
    id: 'admin_123',
    name: 'Administrator',
    email: 'admin@mphm.my.id',
    passwordHash: hashedPassword,
    role: 'Admin',
    status: 'active'
  }).onConflictDoUpdate({
    target: users.email,
    set: { passwordHash: hashedPassword, role: 'Admin' }
  });
  console.log('Admin user seeded successfully!');
}

seedAdmin().catch(console.error);
