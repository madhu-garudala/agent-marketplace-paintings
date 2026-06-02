"use client";

import { useEffect, useState } from "react";
import type { Painting } from "@/data/paintings";

const UNLOCK_KEY = "vgp:unlocked";

function getUnlocked(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(UNLOCK_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setUnlocked(map: Record<string, string>) {
  localStorage.setItem(UNLOCK_KEY, JSON.stringify(map));
}

export function PaintingCard({ painting }: { painting: Painting }) {
  const [unlocked, setUnlockedState] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    const map = getUnlocked();
    if (map[painting.id]) {
      setUnlockedState(true);
      setImgSrc(map[painting.id]);
    }
  }, [painting.id]);

  return (
    <article className="group flex flex-col rounded-2xl border border-ink/15 dark:border-canvas/15 bg-white/70 dark:bg-white/5 backdrop-blur overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[4/3] bg-ink/5 dark:bg-white/5">
        {unlocked && imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={painting.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <LockedPreview seed={painting.imageSeed} local={!!painting.imageFile} />
        )}
        <div className="absolute top-3 left-3 rounded-full bg-ink/80 text-canvas text-[10px] uppercase tracking-widest px-2 py-1">
          {unlocked ? "Unlocked" : "Locked · x402"}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">
            <a href={`/painting/${painting.id}`} className="hover:underline decoration-gold/60 underline-offset-4">
              {painting.title}
            </a>
          </h3>
          <span className="text-sm text-ink/60 dark:text-canvas/60">{painting.year}</span>
        </div>
        <p className="mt-1 text-xs text-ink/60 dark:text-canvas/60">
          {painting.medium} · {painting.dimensions}
        </p>
        <p className="mt-3 text-sm text-ink/80 dark:text-canvas/80 line-clamp-3">
          {painting.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink/50 dark:text-canvas/50">
              Price
            </div>
            <div className="text-base font-semibold">
              ${painting.priceUSD.toFixed(2)}
            </div>
          </div>
          {unlocked ? (
            <a
              href={imgSrc ?? "#"}
              download={`${painting.id}.jpg`}
              className="rounded-full bg-ink text-canvas dark:bg-canvas dark:text-ink px-4 py-2 text-sm hover:opacity-90"
            >
              Download
            </a>
          ) : (
            <a
              href={`/api/image/${painting.id}`}
              className="rounded-full bg-gold text-white px-4 py-2 text-sm hover:bg-gold/90"
              title="Returns HTTP 402 with x402 payment requirements"
            >
              Pay ${painting.priceUSD.toFixed(2)} · x402
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function LockedPreview({ seed, local }: { seed: string; local: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {local ? (
        // Real image — do not leak any bytes in the preview. Use a deterministic
        // painterly gradient seeded by the painting id.
        <div
          aria-hidden
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(120% 80% at 30% 30%, #f5d36a 0%, #c98b2a 35%, #1d3b6a 70%, #0c1730 100%)",
          }}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(seed)}/40/30`}
          alt=""
          aria-hidden
          className="h-full w-full object-cover scale-110 blur-xl opacity-70"
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-ink/70 dark:text-canvas/80">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
        </svg>
        <div className="mt-2 text-[11px] uppercase tracking-widest">
          Pay to reveal
        </div>
      </div>
    </div>
  );
}
