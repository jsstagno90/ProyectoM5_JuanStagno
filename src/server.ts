import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { createRepositorySchema } from "./tools/create-repository.js";
import { octokit } from "./github/client.js";
import { listRepositoriesSchema } from "./tools/list-repositories.js";
import { getRepositorySchema } from "./tools/get-repository.js";
import { createIssueSchema } from "./tools/create-issue.js";
import { updateIssueSchema } from "./tools/update-issue.js";
import { closeIssueSchema } from "./tools/close-issue.js";
import { listIssuesSchema } from "./tools/list-issues.js";
import { getGithubErrorMessage } from "./github/errors.js";


export const server = new McpServer({
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
                        text: `Error al crear el repositorio: ${getGithubErrorMessage(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
);

server.tool(
    "list_repositories",
    "Lista los repositorios públicos de un usuario de GitHub",
    listRepositoriesSchema.shape,
    async (args) => {
        try {
            const response = await octokit.rest.repos.listForUser({
                username: args.owner,
            });

            const repositories = response.data
                .map((repo) => `- ${repo.full_name}`)
                .join("\n");

            return {
                content: [
                    {
                        type: "text",
                        text: `Repositorios de ${args.owner}:\n${repositories}`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error al listar los repositorios: ${getGithubErrorMessage(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
);

server.tool(
    "get_repository",
    "Obtiene información de un repositorio de GitHub",
    getRepositorySchema.shape,
    async (args) => {
        try {
            const response = await octokit.rest.repos.get({
                owner: args.owner,
                repo: args.repo,
            });

            const repository = response.data;

            return {
                content: [
                    {
                        type: "text",
                        text: [
                            `Repositorio: ${repository.full_name}`,
                            `Descripción: ${repository.description ?? "Sin descripción"}`,
                            `Privado: ${repository.private ? "Sí" : "No"}`,
                            `Stars: ${repository.stargazers_count}`,
                            `Forks: ${repository.forks_count}`,
                            `URL: ${repository.html_url}`,
                        ].join("\n"),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error al obtener el repositorio: ${getGithubErrorMessage(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
);

server.tool(
    "create_issue",
    "Crea un nuevo issue en un repositorio de GitHub",
    createIssueSchema.shape,
    async (args) => {
        try {
            const response = await octokit.rest.issues.create({
                owner: args.owner,
                repo: args.repo,
                title: args.title,
                body: args.body,
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `Issue creado correctamente: ${response.data.html_url}`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error al crear el issue: ${getGithubErrorMessage(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
);

server.tool(
    "update_issue",
    "Actualiza un issue existente en GitHub",
    updateIssueSchema.shape,
    async (args) => {
        try {
            const response = await octokit.rest.issues.update({
                owner: args.owner,
                repo: args.repo,
                issue_number: args.issue_number,
                title: args.title,
                body: args.body,
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `Issue actualizado correctamente: ${response.data.html_url}`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error al actualizar el issue: ${getGithubErrorMessage(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
);

server.tool(
    "close_issue",
    "Cierra un issue existente en GitHub",
    closeIssueSchema.shape,
    async (args) => {
        try {
            const response = await octokit.rest.issues.update({
                owner: args.owner,
                repo: args.repo,
                issue_number: args.issue_number,
                state: "closed",
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `Issue cerrado correctamente: ${response.data.html_url}`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error al cerrar el issue: ${getGithubErrorMessage(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
);

server.tool(
    "list_issues",
    "Lista los issues de un repositorio de GitHub",
    listIssuesSchema.shape,
    async (args) => {
        try {
            const response = await octokit.rest.issues.listForRepo({
                owner: args.owner,
                repo: args.repo,
                state: args.state,
            });

            return {
                content: [
                    {
                        type: "text",
                        text: response.data
                            .map(
                                (issue) =>
                                    `#${issue.number} - ${issue.title}\nEstado: ${issue.state}\nURL: ${issue.html_url}`
                            )
                            .join("\n\n"),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error al listar los issues: ${getGithubErrorMessage(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
);

