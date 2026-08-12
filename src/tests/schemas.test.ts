import { describe, expect, it } from "vitest";
import { createRepositorySchema } from "../tools/create-repository.js";

describe("createRepositorySchema", () => {
  it("acepta un repositorio válido", () => {
    const result = createRepositorySchema.safeParse({
      name: "mi-repositorio",
      description: "Repositorio de prueba",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza un nombre con menos de 3 caracteres", () => {
    const result = createRepositorySchema.safeParse({
      name: "ab",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza un nombre con caracteres inválidos", () => {
    const result = createRepositorySchema.safeParse({
      name: "mi repositorio",
    });

    expect(result.success).toBe(false);
  });

  it("permite omitir la descripción", () => {
    const result = createRepositorySchema.safeParse({
      name: "mi-repo",
    });

    expect(result.success).toBe(true);
  });
});