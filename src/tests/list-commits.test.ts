import { describe, it, expect, vi } from "vitest";

const octokitMock = vi.hoisted(() => ({
  rest: {
    repos: {
      listCommits: vi.fn(),
    },
  },
}));

vi.mock("../github/client.js", () => ({
  octokit: octokitMock,
}));

import { server } from "../server.js";

describe("list_commits", () => {
  it("debería listar los commits", async () => {
    const tool = (server as any)._registeredTools["list_commits"];

    const result = await tool.handler({
      owner: "Juan",
      repo: "mi-repo",
    });
    expect(octokitMock.rest.repos.listCommits).toHaveBeenCalledWith({
      owner: "Juan",
      repo: "mi-repo",
      per_page: 10,
    });
    expect(result).toBeDefined();
  });
});

octokitMock.rest.repos.listCommits.mockResolvedValue({
  data: [
    {
      sha: "123456789abcdef",
      commit: {
        author: {
          name: "Juan",
          date: "2026-08-13",
        },
        message: "Agrega nueva funcionalidad",
      },
    },
  ],
});