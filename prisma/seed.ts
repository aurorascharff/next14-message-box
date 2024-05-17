import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';

const prisma = new PrismaClient();

const MESSAGES = [
  {
    content: 'Hello, your application has been approved!',
    createdById: '3ea4ae6c-adda-40eb-b254-9cfe0c8e8113',
    id: '0cd89022-64e8-4a76-aec6-43433478e32f',
  },
  {
    content: 'Great, what are the next steps?',
    createdById: '2bccacd4-64de-4f1d-97ed-9722cdf99cd9',
    id: '0cd89022-64e8-4a76-aec6-43433478e32f',
  },
];

const USERS: User[] = [
  {
    id: '2bccacd4-64de-4f1d-97ed-9722cdf99cd9',
    name: 'John Doe',
  },
  {
    id: '3ea4ae6c-adda-40eb-b254-9cfe0c8e8113',
    name: 'Jane Doe',
  },
];

async function seedMessages() {
  await Promise.all(
    USERS.map(n => {
      return prisma.user.create({ data: { id: n.id, name: n.name } });
    }),
  )
    .then(() => {
      return console.info('[SEED] Succussfully create user records');
    })
    .catch(e => {
      return console.error('[SEED] Failed to create user records', e);
    });
  await Promise.all(
    MESSAGES.map(n => {
      return prisma.message.create({ data: { content: n.content, createdById: n.createdById } });
    }),
  )
    .then(() => {
      return console.info('[SEED] Succussfully create message records');
    })
    .catch(e => {
      return console.error('[SEED] Failed to create message records', e);
    });
}

seedMessages();
