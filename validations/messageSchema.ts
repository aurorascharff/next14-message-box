import { z } from 'zod';

export const messageSchema = z.object({
  content: z.string().min(1, {
    message: 'Content must be at least 1 characters long',
  }),
  createdById: z.string().uuid({
    message: 'Invalid user ID',
  }),
  id: z.string().optional(),
});

export type MessageSchemaType = z.infer<typeof messageSchema>;
