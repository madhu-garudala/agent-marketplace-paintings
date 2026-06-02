#!/usr/bin/env node
// Buyer-side script that exercises the full x402 loop end to end.
//
// Usage:
//   BUYER_PRIVATE_KEY=0x... node scripts/buy.mjs starlit-orchard
//
// Requirements:
//   1. A buyer wallet (separate from the seller wallet in .env.local).
//   2. That wallet funded with Base Sepolia ETH (faucet) + Base Sepolia USDC
//      (https://faucet.circle.com → Base Sepolia).
//   3. The dev server running on http://localhost:3000 (or set BASE_URL).

import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";
import { writeFileSync } from "node:fs";

const BUYER_PRIVATE_KEY = process.env.BUYER_PRIVATE_KEY;
if (!BUYER_PRIVATE_KEY) {
  console.error("Set BUYER_PRIVATE_KEY env var (a different wallet than the seller).");
  process.exit(1);
}

const paintingId = process.argv[2] ?? "starlit-orchard";
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const url = `${baseUrl}/api/image/${paintingId}`;

const account = privateKeyToAccount(BUYER_PRIVATE_KEY);
console.log(`Buyer:  ${account.address}`);
console.log(`Target: ${url}`);

const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: "eip155:*", client: new ExactEvmScheme(account) }],
});

const res = await fetchWithPayment(url);
console.log(`Status: ${res.status}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

const buf = Buffer.from(await res.arrayBuffer());
const out = `${paintingId}.jpg`;
writeFileSync(out, buf);
console.log(`Saved ${buf.length} bytes → ${out}`);
const paymentResponse = res.headers.get("PAYMENT-RESPONSE");
if (paymentResponse) console.log(`PAYMENT-RESPONSE header: ${paymentResponse}`);
