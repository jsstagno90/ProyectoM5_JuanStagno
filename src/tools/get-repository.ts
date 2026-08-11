import { z } from "zod";

export const getRepositorySchema = z.object({
  owner: z
    .string()
    .min(1, "El owner es obligatorio"),

  repo: z
    .string()
    .min(1, "El nombre del repositorio es obligatorio"),
});