import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRepositorySchema } from "./tools/create-repository.js";
import { octokit } from "./github/client.js";



const server = new McpServer({
  name: "github-ai-agent",
  version: "1.0.0",
});

server.tool(
  "create_repository",
  "Crea un nuevo repositorio en GitHub",
  createRepositorySchema.shape,
  async (args) => {
    try {
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name: args.name,
        description: args.description,
        private: false,
      });

      return {
        content: [
          {
            type: "text",
            text: `Repositorio creado correctamente: ${response.data.html_url}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error al crear el repositorio: ${
              error instanceof Error ? error.message : "Error desconocido"
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);


const transport = new StdioServerTransport();
await server.connect(transport);