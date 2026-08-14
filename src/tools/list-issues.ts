import { z } from "zod";

export const listIssuesSchema = z.object({
  owner: z.string().describe("Usuario propietario del repositorio"),
  repo: z.string().describe("Nombre del repositorio"),
  state: z.enum(["open", "closed", "all"]).default("open").describe("Estado de los issues a listar (open, closed, all)"),
});



