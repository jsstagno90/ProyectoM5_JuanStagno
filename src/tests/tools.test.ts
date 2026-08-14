import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

const mockListCommits = vi.fn();

vi.mock("../github/client.js", () => ({
    octokit: {
        rest: {
            repos: {
                listCommits: mockListCommits,
            },
        },
    },
}));

describe("MCP Tools", () => {
    let client: Client;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("debe listar commits usando Octokit mockeado", async () => {
        mockListCommits.mockResolvedValueOnce({
            data: [
                {
                    sha: "24290a8123456789",
                    commit: {
                        author: {
                            name: "Juan Stagno",
                            date: "2026-08-07T02:54:16Z",
                        },
                        message: "OpenAI empieza a contestar el chatbot",
                    },
                },
                {
                    sha: "aa55ac9987654321",
                    commit: {
                        author: {
                            name: "Juan Stagno",
                            date: "2026-08-07T01:25:04Z",
                        },
                        message: "feat: add CRM, checkout and AI tools structure",
                    },
                },
            ],
        });

        const [clientTransport, serverTransport] =
            InMemoryTransport.createLinkedPair();

        client = new Client({
            name: "test-client",
            version: "1.0.0",
        });

        const { server } = await import("../server.js");

        await Promise.all([
            client.connect(clientTransport),
            server.connect(serverTransport),
        ]);

        const result = await client.callTool({
            name: "list_commits",
            arguments: {
                owner: "jsstagno90",
                repo: "artesalandia",
                per_page: 10,
            },
        });

        expect(mockListCommits).toHaveBeenCalledTimes(1);

        expect(mockListCommits).toHaveBeenCalledWith({
            owner: "jsstagno90",
            repo: "artesalandia",
            per_page: 10,
        });

        expect(result.content).toEqual([
            {
                type: "text",
                text: expect.stringContaining(
                    "Commits de jsstagno90/artesalandia"
                ),
            },
        ]);

        expect(result.content).toEqual([
            {
                type: "text",
                text: expect.stringContaining("OpenAI empieza a contestar el chatbot"),
            },
        ]);
    });
});