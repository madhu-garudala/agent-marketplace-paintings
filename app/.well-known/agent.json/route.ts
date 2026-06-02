import { NextResponse } from "next/server";
import { paintings, STORE } from "@/data/paintings";
import { X402_CONFIG } from "@/lib/x402";

const prices = paintings.map((p) => p.priceUSD);
const priceRange = {
  min: Math.min(...prices),
  max: Math.max(...prices),
};

// A2A-style agent card. Lets agents discover the store, its catalog endpoint,
// and the payment protocol used to unlock images.

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const card = {
    schemaVersion: "1.0",
    name: STORE.name,
    description: STORE.tagline,
    owner: { name: STORE.owner, contact: STORE.contact },
    url: origin,
    provider: {
      organization: STORE.name,
      url: origin,
    },
    capabilities: {
      streaming: false,
      pushNotifications: false,
    },
    skills: [
      {
        id: "list-paintings",
        name: "List paintings",
        description:
          "Returns the full catalog of available paintings with metadata, prices, and image URLs (image bytes are gated behind x402 payment).",
        inputModes: ["text"],
        outputModes: ["application/json"],
        endpoint: `${origin}/api/paintings`,
      },
      {
        id: "purchase-image",
        name: "Purchase painting image",
        description:
          "Returns the high-resolution image of a painting after a valid x402 payment is presented in the X-PAYMENT header.",
        inputModes: ["text"],
        outputModes: ["image/jpeg"],
        endpoint: `${origin}/api/image/{paintingId}`,
        payment: {
          protocol: "x402",
          version: 2,
          scheme: "exact",
          network: X402_CONFIG.network,
          payTo: X402_CONFIG.payTo,
          priceUSDRange: { min: priceRange.min, max: priceRange.max },
          note: "Each painting has its own price; see /api/paintings or the 402 response for the exact amount.",
          facilitator: X402_CONFIG.facilitatorUrl,
        },
      },
    ],
    catalog: {
      endpoint: `${origin}/api/paintings`,
      count: paintings.length,
      sample: paintings.slice(0, 5).map((p) => ({
        id: p.id,
        title: p.title,
        year: p.year,
        priceUSD: p.priceUSD,
      })),
    },
  };

  return NextResponse.json(card, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
