import { paintings, STORE } from "@/data/paintings";
import { AgentCard } from "@/components/AgentCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { PaintingCard } from "@/components/PaintingCard";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: STORE.name,
    description: STORE.tagline,
    founder: STORE.owner,
    email: STORE.contact,
    paymentAccepted: "x402 (USDC micropayment)",
    makesOffer: paintings.map((p) => ({
      "@type": "Offer",
      priceCurrency: "USD",
      price: p.priceUSD.toFixed(2),
      itemOffered: {
        "@type": "VisualArtwork",
        name: p.title,
        dateCreated: p.year.toString(),
        artMedium: p.medium,
        width: p.dimensions,
        description: p.description,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      <header className="mb-10 md:mb-14">
        <div className="flex items-start justify-between gap-4">
          <div className="text-[11px] uppercase tracking-[0.3em] text-ink/60 dark:text-canvas/60">
            A rare-paintings storefront · agent-discoverable
          </div>
          <ThemeToggle />
        </div>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          {STORE.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/75 dark:text-canvas/75">
          {STORE.tagline} Every image is sealed until a small USDC payment
          ($0.01–$0.10) is made using the <span className="font-mono">x402</span>{" "}
          standard — built so autonomous agents can browse, pay, and collect.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mt-0">
        <div className="md:col-span-2"><AgentCard /></div>
        <div className="md:col-span-1"><ActivityFeed /></div>
      </div>

      <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 dark:bg-gold/10 px-4 py-3 text-sm text-ink/80 dark:text-canvas/80">
        <span className="font-semibold">Built for autonomous agents.</span>{" "}
        Images are paywalled with the x402 protocol — agents pay in USDC on Base
        and the image bytes stream back. Browsing as a human? Use the buyer
        script in <span className="font-mono">scripts/buy.mjs</span> with a
        funded test wallet.
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-semibold">The collection</h2>
          <span className="text-sm text-ink/60 dark:text-canvas/60">
            {paintings.length} works · $0.01–$0.10 each
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paintings.map((p) => (
            <PaintingCard key={p.id} painting={p} />
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-ink/15 dark:border-canvas/15 pt-6 text-sm text-ink/60 dark:text-canvas/60 flex flex-wrap items-center justify-between gap-3">
        <div>
          © {new Date().getFullYear()} {STORE.name} · {STORE.owner}
        </div>
        <div className="flex gap-3 font-mono text-xs">
          <a href="/.well-known/agent.json" className="hover:text-ink dark:hover:text-canvas">
            agent.json
          </a>
          <a href="/api/paintings" className="hover:text-ink dark:hover:text-canvas">
            /api/paintings
          </a>
          <a href="/sitemap.xml" className="hover:text-ink dark:hover:text-canvas">
            sitemap
          </a>
        </div>
      </footer>
    </main>
  );
}
