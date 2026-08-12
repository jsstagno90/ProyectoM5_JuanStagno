import { z } from "zod";

export const updateIssueSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  issue_number: z.number().int().positive(),
  title: z.string().min(1).optional(),
  body: z.string().optional(),
});