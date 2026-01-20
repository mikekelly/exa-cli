/**
 * Simple logging utility for MCP server
 */
export const log = (message) => {
    console.error(`[EXA-MCP-DEBUG] ${message}`);
};
export const createRequestLogger = (requestId, toolName) => {
    return {
        log: (message) => {
            log(`[${requestId}] [${toolName}] ${message}`);
        },
        start: (query) => {
            log(`[${requestId}] [${toolName}] Starting search for query: "${query}"`);
        },
        error: (error) => {
            log(`[${requestId}] [${toolName}] Error: ${error instanceof Error ? error.message : String(error)}`);
        },
        complete: () => {
            log(`[${requestId}] [${toolName}] Successfully completed request`);
        }
    };
};
