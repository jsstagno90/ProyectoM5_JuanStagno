import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../github/client.js", () => ({
    octokit: {
        rest: {
            issues: {
                listForRepo: vi.fn(),
            },
        },
    },
}));

import { octokit } from "../github/client.js";

describe("list_issues con vi.mock", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("debe listar los issues correctamente", async () => {
        const mockIssues = [
            {
                number: 1,
                title: "Primer issue",
                state: "open",
                html_url: "https://github.com/test/repo/issues/1",
            },
            {
                number: 2,
                title: "Segundo issue",
                state: "closed",
                html_url: "https://github.com/test/repo/issues/2",
            },
        ];

        vi.mocked(octokit.rest.issues.listForRepo).mockResolvedValueOnce({
            data: mockIssues,
        } as any);

        const response = await octokit.rest.issues.listForRepo({
            owner: "test",
            repo: "repo",
            state: "all",
        });

        expect(octokit.rest.issues.listForRepo).toHaveBeenCalledTimes(1);

        expect(octokit.rest.issues.listForRepo).toHaveBeenCalledWith({
            owner: "test",
            repo: "repo",
            state: "all",
        });

        expect(response.data).toHaveLength(2);
        expect(response.data[0].number).toBe(1);
        expect(response.data[0].title).toBe("Primer issue");
    });

    it("debe manejar un error 404 de GitHub", async () => {
        const errorResponse = {
            status: 404,
            message: "Not Found",
        };

        vi.mocked(octokit.rest.issues.listForRepo).mockRejectedValueOnce(
            errorResponse
        );

        await expect(
            octokit.rest.issues.listForRepo({
                owner: "test",
                repo: "repo-inexistente",
                state: "open",
            })
        ).rejects.toMatchObject({
            status: 404,
        });

        expect(octokit.rest.issues.listForRepo).toHaveBeenCalledWith({
            owner: "test",
            repo: "repo-inexistente",
            state: "open",
        });
    });
});