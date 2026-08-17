import { describe, it, expect, vi } from "vitest";

const octokitMock = vi.hoisted(() => ({
    rest: {
        issues: {
            update: vi.fn(),
        },
    },
}));

vi.mock("../github/client.js", () => ({
    octokit: octokitMock,
}));

import { server } from "../server.js";

describe("update_issue", () => {
    it("debería actualizar un issue correctamente", async () => {
        octokitMock.rest.issues.update.mockResolvedValueOnce({
            data: {
                html_url: "https://github.com/Juan/mi-repo/issues/1",
            },
        });

        const tool = (server as any)._registeredTools["update_issue"];

        const result = await tool.handler({
            owner: "Juan",
            repo: "mi-repo",
            issue_number: 1,
            title: "Issue actualizado",
            body: "Contenido actualizado",
        });

        expect(octokitMock.rest.issues.update).toHaveBeenCalledWith({
            owner: "Juan",
            repo: "mi-repo",
            issue_number: 1,
            title: "Issue actualizado",
            body: "Contenido actualizado",
        });

        expect(result).toBeDefined();
    });

    it("debería manejar un error de GitHub", async () => {
        octokitMock.rest.issues.update.mockRejectedValueOnce({
            status: 404,
        });

        const tool = (server as any)._registeredTools["update_issue"];

        const result = await tool.handler({
            owner: "Juan",
            repo: "mi-repo",
            issue_number: 999,
            title: "Issue",
            body: "Contenido",
        });

        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
    });
});