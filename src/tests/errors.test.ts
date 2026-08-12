import { describe, expect, it } from "vitest";
import { getGithubErrorMessage } from "../github/errors.js";

describe("getGithubErrorMessage", () => {
  it("maneja un error 401", () => {
    const error = { status: 401 };

    expect(getGithubErrorMessage(error)).toBe(
      "Token de GitHub inválido o no autenticado."
    );
  });

  it("maneja un error 404", () => {
    const error = { status: 404 };

    expect(getGithubErrorMessage(error)).toBe(
      "El recurso solicitado no existe o no tenés acceso."
    );
  });

  it("maneja un error 403", () => {
    const error = { status: 403 };

    expect(getGithubErrorMessage(error)).toBe(
      "No tenés permisos suficientes para realizar esta operación."
    );
  });

  it("maneja un Error de JavaScript", () => {
    const error = new Error("Algo salió mal");

    expect(getGithubErrorMessage(error)).toBe("Algo salió mal");
  });

  it("maneja un error desconocido", () => {
    expect(getGithubErrorMessage("error desconocido")).toBe(
      "Error desconocido al comunicarse con GitHub"
    );
  });
});