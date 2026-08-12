import { Octokit } from "@octokit/rest";

const githubToken = process.env.GITHUB_TOKEN;

if (!githubToken) {
  throw new Error("GITHUB_TOKEN no está configurado");
}

export const octokit = new Octokit({
  auth: githubToken,
});