import { describe, it, expect, vi } from "vitest";

const octokitMock = vi.hoisted(() => ({
    rest: {
        repos: {
            createForAuthenticatedUser: vi.fn(),
        },
    },
}));

vi.mock("../github/client.js", () => ({
    octokit: octokitMock,
}));

import { server } from "../server.js";

describe("create_repository", () => {
    it("debería crear un repositorio correctamente", async () => {

        // Simulamos la respuesta que normalmente devolvería GitHub
        octokitMock.rest.repos.createForAuthenticatedUser.mockResolvedValueOnce({
            data: {
                html_url: "https://github.com/Juan/mi-repo",
            },
        });

        const tool = (server as any)._registeredTools["create_repository"];

        const result = await tool.handler({
            name: "mi-repo",
            description: "Repositorio de prueba",
        });

        expect(
            octokitMock.rest.repos.createForAuthenticatedUser
        ).toHaveBeenCalledWith({
            name: "mi-repo",
            description: "Repositorio de prueba",
            private: false,
        });

        expect(result).toBeDefined();
    });

    it("debería manejar un error de GitHub", async () => {

        octokitMock.rest.repos.createForAuthenticatedUser.mockRejectedValueOnce({
            status: 401,
        });

        const tool = (server as any)._registeredTools["create_repository"];

        const result = await tool.handler({
            name: "mi-repo",
            description: "Repositorio de prueba",
        });

        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
    });
});