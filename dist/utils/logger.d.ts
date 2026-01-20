/**
 * Simple logging utility for MCP server
 */
export declare const log: (message: string) => void;
export declare const createRequestLogger: (requestId: string, toolName: string) => {
    log: (message: string) => void;
    start: (query: string) => void;
    error: (error: unknown) => void;
    complete: () => void;
};
//# sourceMappingURL=logger.d.ts.map