import { NextResponse } from "next/server";
import { getRecentActivity } from "@/lib/activity";
import { X402_CONFIG } from "@/lib/x402";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const entries = await getRecentActivity(12);
    return NextResponse.json(
      {
        payTo: X402_CONFIG.payTo,
        network: X402_CONFIG.network,
        count: entries.length,
        entries,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=10",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: "activity unavailable", reason, entries: [] },
      { status: 502, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}
