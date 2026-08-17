import { describe, it, expect, vi } from "vitest";

const octokitMock = vi.hoisted(() => ({
    rest: {
        issues: {
            create: vi.fn(),
        },
    },
}));

vi.mock("../github/client.js", () => ({
    octokit: octokitMock,
}));

import { server } from "../server.js";

describe("create_issue", () => {
    it("debería crear un issue correctamente", async () => {
        octokitMock.rest.issues.create.mockResolvedValueOnce({
            data: {
                html_url: "https://github.com/Juan/mi-repo/issues/1",
            },
        });

        const tool = (server as any)._registeredTools["create_issue"];

        const result = await tool.handler({
            owner: "Juan",
            repo: "mi-repo",
            title: "Bug de prueba",
            body: "Este es un issue de prueba",
        });

        expect(octokitMock.rest.issues.create).toHaveBeenCalledWith({
            owner: "Juan",
            repo: "mi-repo",
            title: "Bug de prueba",
            body: "Este es un issue de prueba",
        });

        expect(result).toBeDefined();
    });

    it("debería manejar un error de GitHub", async () => {
        octokitMock.rest.issues.create.mockRejectedValueOnce({
            status: 404,
        });

        const tool = (server as any)._registeredTools["create_issue"];

        const result = await tool.handler({
            owner: "Juan",
            repo: "mi-repo",
            title: "Issue de prueba",
            body: "Contenido",
        });

        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
    });
});