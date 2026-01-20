export interface McpConfig {
    exaApiKey?: string;
    enabledTools?: string[];
    debug?: boolean;
}
/**
 * Initialize and configure the MCP server with all tools, prompts, and resources
 * This function is called by both Vercel Functions and Smithery transports
 *
 * @param server - The MCP server instance (can be from McpServer or mcp-handler)
 * @param config - Configuration object with API key and tool settings
 */
export declare function initializeMcpServer(server: any, config?: McpConfig): void;
//# sourceMappingURL=mcp-handler.d.ts.map