import { describe, it, expect, vi } from "vitest";

const octokitMock = vi.hoisted(() => ({
    rest: {
        repos: {
            listForUser: vi.fn(),
        },
    },
}));

vi.mock("../github/client.js", () => ({
    octokit: octokitMock,
}));

import { server } from "../server.js";

describe("list_repositories", () => {
    it("debería listar los repositorios de un usuario", async () => {
        octokitMock.rest.repos.listForUser.mockResolvedValueOnce({
            data: [
                {
                    full_name: "Juan/repo-1",
                },
                {
                    full_name: "Juan/repo-2",
                },
            ],
        });

        const tool = (server as any)._registeredTools["list_repositories"];

        const result = await tool.handler({
            owner: "Juan",
        });

        expect(octokitMock.rest.repos.listForUser).toHaveBeenCalledWith({
            username: "Juan",
        });

        expect(result).toBeDefined();
    });

    it("debería manejar un error de GitHub", async () => {
        octokitMock.rest.repos.listForUser.mockRejectedValueOnce({
            status: 404,
        });

        const tool = (server as any)._registeredTools["list_repositories"];

        const result = await tool.handler({
            owner: "usuario-inexistente",
        });

        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
    });
});