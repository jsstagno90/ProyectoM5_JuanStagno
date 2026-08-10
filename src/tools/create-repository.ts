import { z } from "zod";

export const createRepositorySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "El nombre solo puede contener letras, números y guiones"
    ),

  description: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional(),
});