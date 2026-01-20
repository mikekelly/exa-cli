# exa-cli

CLI for [Exa AI](https://exa.ai) search via [GAP](https://github.com/anthropics/gap) (Gated Agent Proxy).

By [Mike Kelly](https://github.com/mikekelly).

## Installation

```bash
npm install -g @realmikekelly/exa-cli
```

## Prerequisites

1. **GAP installed and running** - See [GAP documentation](https://github.com/anthropics/gap)
2. **GAP token** - Create with `gap token create`
3. **Exa plugin configured in GAP** - Install with `gap install exa`

## Configuration

Set your GAP token in a `.env` file in your working directory:

```
GAP_TOKEN=your-token-here
```

Or as an environment variable:

```bash
export GAP_TOKEN=your-token-here
```

The CLI checks `.env` first, then falls back to the environment variable.

## Usage

### Web Search

```bash
exa-cli search "your query"
exa-cli search "anthropic claude" -n 10 -t deep
```

Options:
- `-n, --num-results <number>` - Number of results (default: 8)
- `-t, --type <type>` - Search type: auto, fast, deep (default: auto)
- `-l, --livecrawl <mode>` - Livecrawl mode: fallback, preferred (default: fallback)
- `-c, --context-max <chars>` - Max characters for context (default: 10000)

### Code Search

```bash
exa-cli code "react hooks typescript"
exa-cli code "express middleware authentication" -t 10000
```

Options:
- `-t, --tokens <number>` - Number of tokens to return, 1000-50000 (default: 5000)

### Deep Search

```bash
exa-cli deep-search "latest developments in AI safety"
exa-cli deep-search "climate change solutions" -q "renewable energy" "carbon capture"
```

Options:
- `-q, --queries <queries...>` - Additional search queries

### URL Crawling

```bash
exa-cli crawl "https://example.com/article"
exa-cli crawl "https://docs.example.com" -c 5000
```

Options:
- `-c, --max-chars <number>` - Maximum characters to extract (default: 3000)

### LinkedIn Search

```bash
exa-cli linkedin "software engineer san francisco"
exa-cli linkedin "CEO startup" -n 10
```

Options:
- `-n, --num-results <number>` - Number of results (default: 5)

### Company Research

```bash
exa-cli company "Anthropic"
exa-cli company "OpenAI" -n 10
```

Options:
- `-n, --num-results <number>` - Number of results (default: 5)

### Deep Research

Start a comprehensive AI research task:

```bash
exa-cli research start "implications of quantum computing on cryptography"
exa-cli research start "renewable energy adoption" -m exa-research-pro
```

Options:
- `-m, --model <model>` - Model: exa-research or exa-research-pro (default: exa-research)

Check research status:

```bash
exa-cli research check <taskId>
```

## License

MIT
