# Van Gogh Paintings — agent-discoverable storefront

A Vercel-ready Next.js 14 app that sells rare paintings to **autonomous agents** (and humans) for **$0.01 per image** using the **x402** payment standard.

Owner: **Madhu Garudala** · Store: **Van Gogh Paintings**

## What's inside

- **20 paintings** with title, year, medium, dimensions, provenance, description, price (`data/paintings.ts`).
- **Modern storefront** — Next.js App Router + Tailwind + TypeScript. Renders all metadata server-side so it is crawlable by Tavily and other agentic search.
- **Agent card** at `/.well-known/agent.json` (A2A-style) advertising the store, skills, catalog endpoint, and x402 payment details.
- **Public catalog** at `/api/paintings` — JSON list of every work, prices, and image URLs.
- **x402-protected images** at `/api/image/{id}`:
  - First request → `HTTP 402` + `accepts: [paymentRequirements]` (USDC on Base Sepolia by default).
  - Send `X-Payment: <base64 json>` → image bytes stream back.
- **SEO / discoverability** — `sitemap.xml`, `robots.txt`, JSON-LD (`schema.org/Store` + `VisualArtwork`), OpenGraph tags, alternate `application/json` links for the agent card + catalog.

## Plumbing to do (one-line swaps once you give me values)

In `lib/x402.ts`, replace via env vars (Vercel project settings):

| Variable                  | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `X402_PAY_TO`             | Your receiving wallet address              |
| `X402_ASSET`              | Token contract (defaults: USDC Base Sepolia) |
| `X402_NETWORK`            | e.g. `base`, `base-sepolia`, `polygon`     |
| `X402_FACILITATOR_URL`    | x402 facilitator (e.g. `https://x402.org/facilitator`) |
| `NEXT_PUBLIC_SITE_URL`    | Production URL — used in sitemap/robots    |

`verifyPayment()` currently accepts any base64-JSON payload so the demo flow works end-to-end. When the wallet is wired, swap it for a `fetch(facilitator + "/verify")` call — the function signature won't change.

## Local dev

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

```bash
vercel
```

That's it — no extra infra required. Image bytes are streamed from a placeholder source (`picsum.photos`); replace the upstream URL in `app/api/image/[id]/route.ts` with your CDN when real assets are uploaded.

## How an agent buys a painting

```bash
# 1. Discover
curl https://YOUR-SITE/.well-known/agent.json

# 2. List catalog
curl https://YOUR-SITE/api/paintings

# 3. Try image — receive 402 with payment requirements
curl -i https://YOUR-SITE/api/image/starlit-orchard

# 4. Pay (real client builds an x402 EIP-3009 transfer; demo accepts any base64 json)
curl -H "X-Payment: $(echo '{"x402Version":1,"demo":true}' | base64)" \
     https://YOUR-SITE/api/image/starlit-orchard -o starlit-orchard.jpg
```
