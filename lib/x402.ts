// x402 server configuration — uses the official @x402/next + @x402/core SDKs.
//
// One configured x402ResourceServer is shared across all protected routes.
// Network / address / facilitator come from env vars so prod and test can
// differ without code changes.

import { HTTPFacilitatorClient, x402ResourceServer } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

export const X402_CONFIG = {
  payTo: (process.env.X402_PAY_TO ?? "") as `0x${string}`,
  // CAIP-2 network ID. Base Sepolia testnet by default.
  network: (process.env.X402_NETWORK ?? "eip155:84532") as `${string}:${string}`,
  facilitatorUrl:
    process.env.X402_FACILITATOR_URL ?? "https://www.x402.org/facilitator",
};

if (!X402_CONFIG.payTo || !X402_CONFIG.payTo.startsWith("0x")) {
  // Don't crash the build; just log so the demo still renders.
  // The 402 challenge will simply advertise a zero address until you set it.
  console.warn(
    "[x402] X402_PAY_TO is not set — receiver address will be 0x000…",
  );
}

const facilitator = new HTTPFacilitatorClient({
  url: X402_CONFIG.facilitatorUrl,
});

export const x402Server = registerExactEvmScheme(
  new x402ResourceServer(facilitator),
);

export function routeConfigForPainting(args: {
  title: string;
  description: string;
  priceUSD: number;
}) {
  return {
    accepts: {
      scheme: "exact" as const,
      price: `$${args.priceUSD.toFixed(2)}`,
      network: X402_CONFIG.network,
      payTo:
        X402_CONFIG.payTo ||
        ("0x0000000000000000000000000000000000000000" as `0x${string}`),
      maxTimeoutSeconds: 60,
    },
    description: `Access to high-resolution image: ${args.title}. ${args.description}`,
    mimeType: "image/jpeg",
  };
}
