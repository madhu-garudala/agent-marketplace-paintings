import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { findPainting } from "@/data/paintings";
import { routeConfigForPainting, x402Server } from "@/lib/x402";

export const dynamic = "force-dynamic";

// Per-painting x402-protected image. `withX402` handles the 402 challenge,
// verification via the facilitator, and on-chain settlement after a 2xx
// response. We build the route config dynamically because every painting
// has a different title/description in the payment requirements.
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const painting = findPainting(id);
  if (!painting) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const handler = async (_req: NextRequest) => {
    if (painting.imageFile) {
      const filePath = join(process.cwd(), "public", painting.imageFile);
      const bytes = await readFile(filePath);
      const mime = painting.imageFile.endsWith(".png") ? "image/png" : "image/jpeg";
      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": mime,
          "Cache-Control": "private, max-age=3600",
          "X-Painting-Id": painting.id,
        },
      });
    }
    const upstream = `https://picsum.photos/seed/${encodeURIComponent(
      painting.imageSeed,
    )}/1200/900`;
    const imgRes = await fetch(upstream, { cache: "no-store" });
    if (!imgRes.ok || !imgRes.body) {
      return NextResponse.json(
        { error: "image source unavailable" },
        { status: 502 },
      );
    }
    return new NextResponse(imgRes.body, {
      status: 200,
      headers: {
        "Content-Type": imgRes.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "private, max-age=3600",
        "X-Painting-Id": painting.id,
      },
    });
  };

  const wrapped = withX402(
    handler,
    routeConfigForPainting({
      title: `"${painting.title}" (${painting.year})`,
      description: painting.description,
      priceUSD: painting.priceUSD,
    }),
    x402Server,
  );

  return wrapped(req);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "X-PAYMENT, Content-Type",
    },
  });
}
