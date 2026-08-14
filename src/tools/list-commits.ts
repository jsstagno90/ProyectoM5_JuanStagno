import { z } from "zod";

export const listCommitsSchema = z.object({
  owner: z
    .string()
    .min(1, "El owner es obligatorio"),

  repo: z
    .string()
    .min(1, "El nombre del repositorio es obligatorio"),

  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional(),
});
