import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({
    name: "github-ai-agent-test-client",
    version: "1.0.0",
});

const transport = new StdioClientTransport({
    command: "tsx",
    args: ["src/server.ts"],
});

await client.connect(transport);

const result = await client.callTool({
    name: "create_issue",
    arguments: {
        owner: "octocat",
        repo: "Hello-World",
        title: "Found a bug",
        body: "I'm having a problem with this.",
    },
});

console.error(result);

await transport.close();