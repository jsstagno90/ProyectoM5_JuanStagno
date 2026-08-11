import { z } from "zod";

export const createIssueSchema = z.object({
  owner: z
    .string()
    .min(1, "El owner es obligatorio"),

  repo: z
    .string()
    .min(1, "El nombre del repositorio es obligatorio"),

  title: z
    .string()
    .min(1, "El título del issue es obligatorio")
    .max(256, "El título no puede superar los 256 caracteres"),

  body: z
    .string()
    .optional(),
});