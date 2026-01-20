# exa-cli

CLI for [Exa AI](https://exa.ai) search via [GAP](https://github.com/anthropics/gap) (Gated Agent Proxy).

By [Mike Kelly](https://github.com/mikekelly).

## Installation

```bash
npm install -g github:mikekelly/exa-cli
```

Or via npm (if available):
```bash
npm install -g @realmikekelly/exa-cli
```

## Prerequisites

1. **GAP installed and running** - Install from [github.com/anthropics/gap](https://github.com/anthropics/gap)
2. **GAP token** - Create one with `gap token create`
3. **Exa plugin configured in GAP** - Install with `gap install exa`

## Configuration

Set your GAP token in one of two ways:

1. Create a `.env` file in your working directory:
   ```
   GAP_TOKEN=your-token-here
   ```

2. Or set it as an environment variable:
   ```bash
   export GAP_TOKEN=your-token-here
   ```

The CLI checks `.env` first, then falls back to the environment variable.

## Commands

### Web Search
```bash
exa search "your query"
exa search "anthropic claude" -n 10 -t deep
```

Options:
- `-n, --num-results <number>` - Number of results (default: 8)
- `-t, --type <type>` - Search type: auto, fast, deep (default: auto)
- `-l, --livecrawl <mode>` - Livecrawl mode: fallback, preferred (default: fallback)
- `-c, --context-max <chars>` - Max characters for context (default: 10000)

### Code Search
```bash
exa code "react hooks typescript"
exa code "express middleware authentication" -t 10000
```

Options:
- `-t, --tokens <number>` - Number of tokens to return, 1000-50000 (default: 5000)

### Deep Search
```bash
exa deep-search "what are the latest developments in AI safety"
exa deep-search "climate change solutions" -q "renewable energy" "carbon capture"
```

Options:
- `-q, --queries <queries...>` - Additional search queries

### URL Crawling
```bash
exa crawl "https://example.com/article"
exa crawl "https://docs.example.com" -c 5000
```

Options:
- `-c, --max-chars <number>` - Maximum characters to extract (default: 3000)

### LinkedIn Search
```bash
exa linkedin "software engineer san francisco"
exa linkedin "CEO startup" -n 10
```

Options:
- `-n, --num-results <number>` - Number of results (default: 5)

### Company Research
```bash
exa company "Anthropic"
exa company "OpenAI" -n 10
```

Options:
- `-n, --num-results <number>` - Number of results (default: 5)

### Deep Research

Start a comprehensive AI research task:
```bash
exa research start "What are the implications of quantum computing on cryptography?"
exa research start "Analysis of renewable energy adoption" -m exa-research-pro
```

Options:
- `-m, --model <model>` - Model: exa-research or exa-research-pro (default: exa-research)

Check research status:
```bash
exa research check <taskId>
```

## License

MIT
