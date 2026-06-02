"use client";

import { useEffect, useState } from "react";

type Candidate = { id: string; title: string };
type Entry = {
  txHash: string;
  from: string;
  amountUSDC: number;
  explorerUrl: string;
  candidates: Candidate[];
};

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function ActivityFeed() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      try {
        const res = await fetch("/api/activity", { cache: "no-store" });
        const body = await res.json();
        if (!alive) return;
        if (!res.ok) {
          setError(body.reason ?? `status ${res.status}`);
        } else {
          setEntries(body.entries ?? []);
          setError(null);
        }
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "fetch failed");
      } finally {
        if (alive) setLoading(false);
        if (alive) timer = setTimeout(tick, 20_000);
      }
    }

    tick();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <section
      aria-label="Recent on-chain activity"
      className="rounded-2xl border border-ink/15 dark:border-canvas/15 bg-white/70 dark:bg-white/5 backdrop-blur p-5 md:p-6 shadow-sm"
    >
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-ink/60 dark:text-canvas/60">
            Live activity · on-chain
          </div>
          <h3 className="mt-1 text-lg font-semibold">Recent purchases</h3>
        </div>
        <LiveDot loading={loading} error={!!error} />
      </header>

      {error && (
        <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
          Couldn&rsquo;t reach Base RPC: {error}
        </p>
      )}

      {!error && entries && entries.length === 0 && (
        <p className="mt-4 text-sm text-ink/60 dark:text-canvas/60">
          No purchases yet in the last ~5 hours. Be the first agent to buy.
        </p>
      )}

      {entries && entries.length > 0 && (
        <ol className="mt-4 divide-y divide-ink/10 dark:divide-canvas/10">
          {entries.map((e) => (
            <li key={e.txHash} className="py-2.5 flex items-center gap-3 text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold tabular-nums">
                    +${e.amountUSDC.toFixed(2)}
                  </span>
                  <span className="text-ink/60 dark:text-canvas/60">USDC from</span>
                  <span className="font-mono text-xs">{shortAddr(e.from)}</span>
                </div>
                {e.candidates.length > 0 && (
                  <div className="text-xs text-ink/60 dark:text-canvas/60 truncate">
                    {e.candidates.length === 1 ? "likely: " : "candidates: "}
                    {e.candidates.map((c) => c.title).join(" · ")}
                  </div>
                )}
              </div>
              <a
                href={e.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-ink/60 dark:text-canvas/60 hover:text-ink dark:hover:text-canvas underline decoration-dotted underline-offset-4 shrink-0"
              >
                tx ↗
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function LiveDot({ loading, error }: { loading: boolean; error: boolean }) {
  const color = error ? "bg-amber-500" : loading ? "bg-ink/30 dark:bg-canvas/30" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink/60 dark:text-canvas/60">
      <span className={`relative inline-flex h-2 w-2 ${color} rounded-full`}>
        {!error && !loading && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 animate-ping" />
        )}
      </span>
      {error ? "offline" : loading ? "loading" : "live"}
    </div>
  );
}
