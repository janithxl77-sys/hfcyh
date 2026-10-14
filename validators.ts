import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().min(10).max(2000),
  imageUrl: z.string().url(),
  category: z.string().min(2).max(120),
  link: z.string().url(),
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.number().int().positive()).min(1),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  message: z.string().min(10).max(3000),
});
