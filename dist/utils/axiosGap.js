import axios, { isAxiosError } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as fs from 'fs';
import * as path from 'path';
import * as tls from 'tls';
import * as dotenv from 'dotenv';
// Load .env from current working directory first
dotenv.config({ path: path.join(process.cwd(), '.env') });
const GAP_PROXY_HOST = 'localhost';
const GAP_PROXY_PORT = 9443;
// CA cert location varies by platform
function getGapCaPath() {
    if (process.platform === 'darwin') {
        return path.join(process.env.HOME || '', 'Library', 'Application Support', 'gap', 'ca.crt');
    }
    else if (process.platform === 'linux') {
        return '/var/lib/gap/ca.crt';
    }
    else {
        // Fallback for other platforms
        return path.join(process.env.HOME || '', '.config', 'gap', 'ca.crt');
    }
}
// Cache for combined CA certs
let cachedCa;
function getCombinedCa() {
    if (cachedCa)
        return cachedCa;
    // Load GAP CA certificate
    let gapCaCert;
    try {
        gapCaCert = fs.readFileSync(getGapCaPath(), 'utf-8');
    }
    catch (err) {
        throw new Error(`Failed to load GAP CA certificate from ${getGapCaPath()}. ` +
            `Make sure GAP is installed and configured. Error: ${err instanceof Error ? err.message : String(err)}`);
    }
    // Combine GAP CA with Node's root CAs
    const rootCerts = tls.rootCertificates.join('\n');
    cachedCa = `${rootCerts}\n${gapCaCert}`;
    return cachedCa;
}
/**
 * Get GAP token from environment
 * Priority: GAP_TOKEN from .env (pwd) -> GAP_TOKEN from environment
 */
function getGapToken(providedToken) {
    const token = providedToken || process.env.GAP_TOKEN;
    if (!token) {
        throw new Error('GAP_TOKEN not found. Please set GAP_TOKEN in your .env file or environment.\n' +
            'You can create a token by running: gap token create');
    }
    return token;
}
/**
 * Create an axios instance configured to route through GAP proxy
 */
export function create(options) {
    const gapToken = getGapToken(options?.gapToken);
    const combinedCa = getCombinedCa();
    // Create proxy agent
    const proxyUrl = `http://${GAP_PROXY_HOST}:${GAP_PROXY_PORT}`;
    const agent = new HttpsProxyAgent(proxyUrl, {
        headers: {
            'Proxy-Authorization': `Bearer ${gapToken}`
        }
    });
    // Override the callback to inject CA into the socket options
    const originalCallback = agent.connect.bind(agent);
    agent.connect = function (req, opts) {
        opts.ca = combinedCa;
        return originalCallback(req, opts);
    };
    const instance = axios.create({
        httpsAgent: agent,
        proxy: false, // Disable axios's built-in proxy handling
    });
    return instance;
}
export { isAxiosError };
export default { create, isAxiosError };
