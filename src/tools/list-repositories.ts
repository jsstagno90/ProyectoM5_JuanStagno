import { z } from "zod";

export const listRepositoriesSchema = z.object({
      owner: z.string().min(1, "El owner es obligatorio")
});