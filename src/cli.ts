#!/usr/bin/env node
import { Command } from 'commander';
import { create as createAxiosGap, isAxiosError } from './utils/axiosGap.js';
import { API_CONFIG } from './tools/config.js';
import type {
  ExaSearchRequest,
  ExaSearchResponse,
  ExaCodeRequest,
  ExaCodeResponse,
  DeepResearchRequest,
  DeepResearchStartResponse,
  DeepResearchCheckResponse
} from './types.js';

const program = new Command();

// Create axios instance with GAP proxy
function getAxios() {
  return createAxiosGap();
}

program
  .name('exa')
  .description('CLI for Exa AI search via GAP proxy')
  .version('1.0.0');

// Web Search
program
  .command('search <query>')
  .description('Search the web using Exa AI')
  .option('-n, --num-results <number>', 'Number of results', '8')
  .option('-t, --type <type>', 'Search type: auto, fast, deep', 'auto')
  .option('-l, --livecrawl <mode>', 'Livecrawl mode: fallback, preferred', 'fallback')
  .option('-c, --context-max <chars>', 'Max characters for context', '10000')
  .action(async (query: string, options) => {
    try {
      const axios = getAxios();
      const searchRequest: ExaSearchRequest = {
        query,
        type: options.type as 'auto' | 'fast' | 'deep',
        numResults: parseInt(options.numResults),
        contents: {
          text: true,
          context: {
            maxCharacters: parseInt(options.contextMax)
          },
          livecrawl: options.livecrawl as 'fallback' | 'preferred'
        }
      };

      const response = await axios.post<ExaSearchResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}`,
        searchRequest,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          timeout: 25000
        }
      );

      if (response.data?.context) {
        console.log(response.data.context);
      } else {
        console.log('No results found.');
      }
    } catch (error) {
      handleError(error, 'Search');
    }
  });

// Code Search
program
  .command('code <query>')
  .description('Search for code context using Exa AI')
  .option('-t, --tokens <number>', 'Number of tokens to return (1000-50000)', '5000')
  .action(async (query: string, options) => {
    try {
      const axios = getAxios();
      const codeRequest: ExaCodeRequest = {
        query,
        tokensNum: parseInt(options.tokens)
      };

      const response = await axios.post<ExaCodeResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTEXT}`,
        codeRequest,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data?.response) {
        console.log(response.data.response);
      } else {
        console.log('No code context found.');
      }
    } catch (error) {
      handleError(error, 'Code search');
    }
  });

// Deep Search
program
  .command('deep-search <objective>')
  .description('Deep web search with query expansion')
  .option('-q, --queries <queries...>', 'Additional search queries')
  .action(async (objective: string, options) => {
    try {
      const axios = getAxios();
      const searchRequest: ExaSearchRequest = {
        query: objective,
        type: 'deep',
        contents: {
          context: true
        }
      };

      if (options.queries?.length) {
        searchRequest.additionalQueries = options.queries;
      }

      const response = await axios.post<ExaSearchResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}`,
        searchRequest,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          timeout: 25000
        }
      );

      if (response.data?.context) {
        console.log(response.data.context);
      } else {
        console.log('No results found.');
      }
    } catch (error) {
      handleError(error, 'Deep search');
    }
  });

// Crawl URL
program
  .command('crawl <url>')
  .description('Extract content from a URL')
  .option('-c, --max-chars <number>', 'Maximum characters to extract', '3000')
  .action(async (url: string, options) => {
    try {
      const axios = getAxios();
      const crawlRequest = {
        ids: [url],
        contents: {
          text: {
            maxCharacters: parseInt(options.maxChars)
          },
          livecrawl: 'preferred'
        }
      };

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/contents`,
        crawlRequest,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          timeout: 25000
        }
      );

      if (response.data?.results) {
        console.log(JSON.stringify(response.data, null, 2));
      } else {
        console.log('No content found.');
      }
    } catch (error) {
      handleError(error, 'Crawl');
    }
  });

// LinkedIn Search
program
  .command('linkedin <query>')
  .description('Search LinkedIn profiles')
  .option('-n, --num-results <number>', 'Number of results', '5')
  .action(async (query: string, options) => {
    try {
      const axios = getAxios();
      const searchRequest: ExaSearchRequest = {
        query: `${query} LinkedIn profile`,
        type: 'auto',
        numResults: parseInt(options.numResults),
        category: 'people',
        contents: {
          text: {
            maxCharacters: API_CONFIG.DEFAULT_MAX_CHARACTERS
          }
        }
      };

      const response = await axios.post<ExaSearchResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}`,
        searchRequest,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          timeout: 25000
        }
      );

      if (response.data?.results) {
        console.log(JSON.stringify(response.data, null, 2));
      } else {
        console.log('No LinkedIn profiles found.');
      }
    } catch (error) {
      handleError(error, 'LinkedIn search');
    }
  });

// Company Research
program
  .command('company <name>')
  .description('Research a company')
  .option('-n, --num-results <number>', 'Number of results', '5')
  .action(async (name: string, options) => {
    try {
      const axios = getAxios();
      const searchRequest: ExaSearchRequest = {
        query: `${name} company`,
        type: 'auto',
        numResults: parseInt(options.numResults),
        category: 'company',
        contents: {
          text: true
        }
      };

      const response = await axios.post<ExaSearchResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}`,
        searchRequest,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          timeout: 25000
        }
      );

      if (response.data?.results) {
        console.log(JSON.stringify(response.data, null, 2));
      } else {
        console.log('No company information found.');
      }
    } catch (error) {
      handleError(error, 'Company research');
    }
  });

// Deep Research - Start
const research = program
  .command('research')
  .description('Deep research commands');

research
  .command('start <instructions>')
  .description('Start a deep research task')
  .option('-m, --model <model>', 'Model: exa-research or exa-research-pro', 'exa-research')
  .action(async (instructions: string, options) => {
    try {
      const axios = getAxios();
      const researchRequest: DeepResearchRequest = {
        model: options.model as 'exa-research' | 'exa-research-pro',
        instructions,
        output: {
          inferSchema: false
        }
      };

      const response = await axios.post<DeepResearchStartResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEARCH_TASKS}`,
        researchRequest,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          timeout: 25000
        }
      );

      if (response.data?.id) {
        console.log(JSON.stringify({
          taskId: response.data.id,
          model: options.model,
          message: `Research task started. Check status with: exa research check ${response.data.id}`
        }, null, 2));
      } else {
        console.log('Failed to start research task.');
      }
    } catch (error) {
      handleError(error, 'Research start');
    }
  });

research
  .command('check <taskId>')
  .description('Check status of a deep research task')
  .action(async (taskId: string) => {
    try {
      const axios = getAxios();

      const response = await axios.get<DeepResearchCheckResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEARCH_TASKS}/${taskId}`,
        {
          headers: {
            'accept': 'application/json'
          },
          timeout: 25000
        }
      );

      if (response.data) {
        if (response.data.status === 'completed') {
          console.log(JSON.stringify({
            status: response.data.status,
            taskId: response.data.id,
            report: response.data.data?.report || 'No report generated',
            timeMs: response.data.timeMs,
            model: response.data.model
          }, null, 2));
        } else if (response.data.status === 'running') {
          console.log(JSON.stringify({
            status: response.data.status,
            taskId: response.data.id,
            message: 'Research in progress. Check again shortly.'
          }, null, 2));
        } else {
          console.log(JSON.stringify({
            status: response.data.status,
            taskId: response.data.id,
            message: `Research task ${response.data.status}`
          }, null, 2));
        }
      } else {
        console.log('No response from research API.');
      }
    } catch (error) {
      handleError(error, 'Research check');
    }
  });

function handleError(error: unknown, context: string): void {
  if (isAxiosError(error)) {
    const statusCode = error.response?.status || 'unknown';
    const errorMessage = error.response?.data?.message || error.message;
    console.error(`${context} error (${statusCode}): ${errorMessage}`);
  } else if (error instanceof Error) {
    console.error(`${context} error: ${error.message}`);
  } else {
    console.error(`${context} error: ${String(error)}`);
  }
  process.exit(1);
}

program.parse();
