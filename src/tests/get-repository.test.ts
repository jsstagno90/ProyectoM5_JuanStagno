import { describe, it, expect, vi } from "vitest";

const octokitMock = vi.hoisted(() => ({
    rest: {
        repos: {
            get: vi.fn(),
        },
    },
}));

vi.mock("../github/client.js", () => ({
    octokit: octokitMock,
}));

import { server } from "../server.js";

describe("get_repository", () => {

    it("debería obtener un repositorio correctamente", async () => {

        octokitMock.rest.repos.get.mockResolvedValueOnce({
            data: {
                name: "mi-repo",
                full_name: "Juan/mi-repo",
                description: "Repositorio de prueba",
                html_url: "https://github.com/Juan/mi-repo",
            },
        });

        const tool = (server as any)._registeredTools["get_repository"];

        const result = await tool.handler({
            owner: "Juan",
            repo: "mi-repo",
        });

        expect(octokitMock.rest.repos.get).toHaveBeenCalledWith({
            owner: "Juan",
            repo: "mi-repo",
        });

        expect(result).toBeDefined();
    });

    it("debería manejar un error 404", async () => {

        octokitMock.rest.repos.get.mockRejectedValueOnce({
            status: 404,
        });

        const tool = (server as any)._registeredTools["get_repository"];

        const result = await tool.handler({
            owner: "Juan",
            repo: "repo-inexistente",
        });

        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
    });
});