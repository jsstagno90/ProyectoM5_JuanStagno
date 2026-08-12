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
    name: "list_issues",
    arguments: {
    owner: "octocat",
    repo: "Hello-World",
    state: "closed",

},
});

console.error(result);

await transport.close();