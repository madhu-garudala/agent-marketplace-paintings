import { NextResponse } from "next/server";
import { paintings, STORE } from "@/data/paintings";

// Public catalog endpoint — designed to be crawled / fetched by agents
// (Tavily, A2A clients, etc.). Returns metadata only; the image bytes
// are paywalled behind /api/image/[id] via x402.

export const dynamic = "force-static";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  return NextResponse.json(
    {
      store: STORE,
      count: paintings.length,
      currency: "USD",
      paymentProtocol: "x402",
      paintings: paintings.map((p) => ({
        id: p.id,
        title: p.title,
        year: p.year,
        medium: p.medium,
        dimensions: p.dimensions,
        provenance: p.provenance,
        description: p.description,
        priceUSD: p.priceUSD,
        detailUrl: `${origin}/painting/${p.id}`,
        imageUrl: `${origin}/api/image/${p.id}`,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
        // CORS so remote agents can fetch directly from the browser
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
