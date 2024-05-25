import { z } from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const profileSchema = z.object({
  name: z.string().min(3).max(100),
  username: z.string().min(3).max(50),
  portfolioWebsite: z.string().url().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});