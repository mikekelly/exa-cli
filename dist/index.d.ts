#!/usr/bin/env node
import { z } from "zod";
export declare const configSchema: z.ZodObject<{
    exaApiKey: z.ZodOptional<z.ZodString>;
    enabledTools: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodString]>>;
    tools: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodString]>>;
    debug: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    debug: boolean;
    exaApiKey?: string | undefined;
    enabledTools?: string | string[] | undefined;
    tools?: string | string[] | undefined;
}, {
    exaApiKey?: string | undefined;
    enabledTools?: string | string[] | undefined;
    tools?: string | string[] | undefined;
    debug?: boolean | undefined;
}>;
export declare const stateless = true;
/**
 * Exa AI Web Search MCP Server
 *
 * This MCP server integrates Exa AI's search capabilities with Claude and other MCP-compatible clients.
 * Exa is a search engine and API specifically designed for up-to-date web searching and retrieval,
 * offering more recent and comprehensive results than what might be available in an LLM's training data.
 *
 * The server provides tools that enable:
 * - Real-time web searching with configurable parameters
 * - Company research and analysis
 * - Web content crawling
 * - LinkedIn search capabilities
 * - Deep research workflows
 * - And more!
 *
 * This is the Smithery CLI entry point. For Vercel deployment, see api/mcp.ts
 */
export default function ({ config }: {
    config: z.infer<typeof configSchema>;
}): import("@modelcontextprotocol/sdk/server").Server<{
    method: string;
    params?: {
        [x: string]: unknown;
        task?: {
            [x: string]: unknown;
            ttl?: number | null | undefined;
            pollInterval?: number | undefined;
        } | undefined;
        _meta?: {
            [x: string]: unknown;
            progressToken?: string | number | undefined;
            "io.modelcontextprotocol/related-task"?: {
                [x: string]: unknown;
                taskId: string;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    method: string;
    params?: {
        [x: string]: unknown;
        _meta?: {
            [x: string]: unknown;
            "io.modelcontextprotocol/related-task"?: {
                [x: string]: unknown;
                taskId: string;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    [x: string]: unknown;
    _meta?: {
        [x: string]: unknown;
        "io.modelcontextprotocol/related-task"?: {
            [x: string]: unknown;
            taskId: string;
        } | undefined;
    } | undefined;
}>;
//# sourceMappingURL=index.d.ts.map