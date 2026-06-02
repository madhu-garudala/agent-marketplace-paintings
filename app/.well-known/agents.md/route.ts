import { paintings, STORE } from "@/data/paintings";
import { X402_CONFIG } from "@/lib/x402";

// /.well-known/agents.md — a markdown agent manifest, the human-readable
// counterpart to /.well-known/agent.json. Intended for LLM agents that
// prefer narrative over JSON (Tavily, Perplexity, etc.).

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const sample = paintings
    .slice(0, 5)
    .map((p) => `- \`${p.id}\` — *${p.title}* (${p.year}) · $${p.priceUSD.toFixed(2)}`)
    .join("\n");

  const md = `# ${STORE.name}

${STORE.tagline}

- **Owner:** ${STORE.owner}
- **Contact:** ${STORE.contact}
- **Storefront:** ${origin}
- **Agent card (JSON):** ${origin}/.well-known/agent.json
- **Catalog (JSON):** ${origin}/api/paintings
- **Sitemap:** ${origin}/sitemap.xml

## What this site sells

${paintings.length} rare paintings. Each one has a public title, year, medium,
dimensions, provenance, description, and price. The **image bytes** are gated
behind an x402 micropayment of **$0.01 USDC**.

## How to buy

Every painting image lives at:

\`\`\`
GET ${origin}/api/image/{paintingId}
\`\`\`

The first request returns **HTTP 402 Payment Required** with x402 payment
requirements in the \`PAYMENT-REQUIRED\` response header (base64-encoded
JSON) and in the response body. Submit a valid \`X-PAYMENT\` header and the
image bytes stream back.

### Payment details

| Field        | Value |
|--------------|-------|
| Protocol     | x402 (v2) |
| Scheme       | exact |
| Network      | ${X402_CONFIG.network} (Base Sepolia testnet) |
| Asset        | USDC |
| Price        | $${X402_CONFIG.priceUSD.toFixed(2)} per image |
| Pay to       | \`${X402_CONFIG.payTo}\` |
| Facilitator  | ${X402_CONFIG.facilitatorUrl} |

## Agent quick-start (TypeScript)

\`\`\`ts
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.BUYER_PRIVATE_KEY);
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: "eip155:*", client: new ExactEvmScheme(account) }],
});

const res = await fetchWithPayment("${origin}/api/image/starlit-orchard");
// → image/jpeg bytes
\`\`\`

## Sample inventory

${sample}

…and ${paintings.length - 5} more. Full list at [\`/api/paintings\`](${origin}/api/paintings).

## Discovery

- Crawlable, agent-friendly: every painting has its own SSR'd page at
  \`${origin}/painting/{id}\` with \`schema.org/VisualArtwork\` JSON-LD.
- \`robots.txt\` allows all user agents.
- Sitemap lists the store homepage, agent card, catalog endpoint, and one
  URL per painting.

---

*This file is the markdown counterpart to [\`/.well-known/agent.json\`](${origin}/.well-known/agent.json). Both describe the same agent and stay in sync.*
`;

  return new Response(md, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
