import { describe, expect, it } from "vitest";
import { createRepositorySchema } from "../tools/create-repository.js";
import { listCommitsSchema } from "../tools/list-commits.js";

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
  } );
});

describe("listCommitsSchema", () => {
  it("acepta parámetros válidos con owner y repo", () => {
    const result = listCommitsSchema.safeParse({
      owner: "jsstagno90",
      repo: "artesalandia",
    });

    expect(result.success).toBe(true);
  });

  it("acepta el parámetro opcional per_page", () => {
    const result = listCommitsSchema.safeParse({
      owner: "jsstagno90",
      repo: "artesalandia",
      per_page: 5,
    });

    expect(result.success).toBe(true);
  });

  it("rechaza si falta el owner", () => {
    const result = listCommitsSchema.safeParse({
      repo: "artesalandia",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza si falta el repo", () => {
    const result = listCommitsSchema.safeParse({
      owner: "jsstagno90",
    });

    expect(result.success).toBe(false);
  });
});