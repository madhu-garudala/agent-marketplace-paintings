import { STORE, paintings } from "@/data/paintings";

export function AgentCard() {
  return (
    <section
      id="agent-card"
      className="rounded-2xl border border-ink/15 dark:border-canvas/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 md:p-8 shadow-sm"
      aria-label="Agent card"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-ink/60 dark:text-canvas/60">
            Agent Card · A2A discoverable
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold">
            {STORE.name}
          </h2>
          <p className="mt-1 text-ink/80 dark:text-canvas/80">
            Curated by <span className="font-medium">{STORE.owner}</span> ·{" "}
            <a className="underline decoration-gold/60 underline-offset-4" href={`mailto:${STORE.contact}`}>
              {STORE.contact}
            </a>
          </p>
          <p className="mt-3 max-w-xl text-ink/70 dark:text-canvas/70">{STORE.tagline}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <Stat label="Works" value={paintings.length.toString()} />
          <Stat label="Per image" value="$0.01–0.10" />
          <Stat label="Protocol" value="x402" />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <Pill href="/.well-known/agent.json">/.well-known/agent.json</Pill>
        <Pill href="/.well-known/agents.md">/.well-known/agents.md</Pill>
        <Pill href="/api/paintings">/api/paintings</Pill>
        <Pill href="/sitemap.xml">/sitemap.xml</Pill>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/10 dark:border-canvas/10 bg-canvas/60 dark:bg-white/5 px-3 py-2">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-ink/60 dark:text-canvas/60">
        {label}
      </div>
    </div>
  );
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-full border border-ink/15 dark:border-canvas/15 bg-canvas/60 dark:bg-white/5 px-3 py-1 font-mono text-ink/70 dark:text-canvas/70 hover:bg-canvas hover:text-ink dark:hover:bg-white/10 dark:hover:text-canvas transition"
    >
      {children}
    </a>
  );
}
