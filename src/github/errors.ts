export function getGithubErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  ) {
    const status = (error as { status: number }).status;

    switch (status) {
      case 401:
        return "Token de GitHub inválido o no autenticado.";

      case 403:
        return "No tenés permisos suficientes para realizar esta operación.";

      case 404:
        return "El recurso solicitado no existe o no tenés acceso.";

      case 422:
        return "GitHub rechazó los datos enviados.";

      case 429:
        return "Se alcanzó el límite de solicitudes de GitHub.";

      default:
        return `GitHub respondió con el código de error ${status}.`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Error desconocido al comunicarse con GitHub";
}