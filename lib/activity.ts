// Live on-chain activity for the seller wallet.
//
// Reads USDC `Transfer` events where `to = payTo` from the configured
// network's public RPC via viem. No DB, no API key, no indexer.
//
// Tradeoff: we don't know *which painting* was purchased from on-chain
// data alone (the ERC-20 Transfer event has no painting metadata). We
// surface the amount + tx, and list the painting(s) whose price matches
// as candidate attributions.

import { createPublicClient, http, parseAbiItem } from "viem";
import { baseSepolia, base } from "viem/chains";
import { paintings } from "@/data/paintings";
import { X402_CONFIG } from "@/lib/x402";

// USDC contract addresses.
const USDC: Record<string, `0x${string}`> = {
  "eip155:84532": "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  "eip155:8453": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base mainnet
};

const CHAINS = {
  "eip155:84532": baseSepolia,
  "eip155:8453": base,
} as const;

type NetworkKey = keyof typeof CHAINS;

function getChain(network: string) {
  return CHAINS[network as NetworkKey] ?? baseSepolia;
}

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

export type ActivityEntry = {
  txHash: `0x${string}`;
  blockNumber: string;
  from: `0x${string}`;
  to: `0x${string}`;
  amountUSDC: number;
  candidates: Array<{ id: string; title: string }>;
  explorerUrl: string;
  timestampISO?: string;
};

export async function getRecentActivity(limit = 12): Promise<ActivityEntry[]> {
  const payTo = X402_CONFIG.payTo;
  const network = X402_CONFIG.network;
  if (!payTo || !payTo.startsWith("0x")) return [];

  const chain = getChain(network);
  const usdc = USDC[network] ?? USDC["eip155:84532"];

  const client = createPublicClient({ chain, transport: http() });

  // Public Base RPC caps eth_getLogs at 2000 blocks (~1h on Base @ 2s).
  const latest = await client.getBlockNumber();
  const fromBlock = latest > 1999n ? latest - 1999n : 0n;

  const logs = await client.getLogs({
    address: usdc,
    event: TRANSFER_EVENT,
    args: { to: payTo as `0x${string}` },
    fromBlock,
    toBlock: latest,
  });

  const explorerBase =
    network === "eip155:8453"
      ? "https://basescan.org"
      : "https://sepolia.basescan.org";

  const entries = logs
    .slice(-limit) // most recent N
    .reverse()
    .map((log) => {
      const amountUSDC = Number(log.args.value ?? 0n) / 1_000_000;
      const candidates = paintings
        .filter((p) => Math.abs(p.priceUSD - amountUSDC) < 1e-9)
        .map((p) => ({ id: p.id, title: p.title }));
      return {
        txHash: log.transactionHash,
        blockNumber: log.blockNumber?.toString() ?? "",
        from: log.args.from as `0x${string}`,
        to: log.args.to as `0x${string}`,
        amountUSDC,
        candidates,
        explorerUrl: `${explorerBase}/tx/${log.transactionHash}`,
      } satisfies ActivityEntry;
    });

  return entries;
}
