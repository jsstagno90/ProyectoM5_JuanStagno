import { describe, it, expect } from "vitest";
import { server } from "../server.js";

describe("MCP Tools", () => {
    it("debe existir el servidor MCP", () => {
        expect(server).toBeDefined();
    });
});