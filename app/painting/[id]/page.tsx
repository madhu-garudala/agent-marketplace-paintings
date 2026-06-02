import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findPainting, paintings, STORE } from "@/data/paintings";
import { PaintingCard } from "@/components/PaintingCard";

export function generateStaticParams() {
  return paintings.map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const p = findPainting(params.id);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.title} (${p.year}) — ${STORE.name}`,
    description: p.description,
    openGraph: {
      title: `${p.title} (${p.year})`,
      description: p.description,
      type: "article",
    },
  };
}

export default function PaintingPage({ params }: { params: { id: string } }) {
  const painting = findPainting(params.id);
  if (!painting) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: painting.title,
    dateCreated: painting.year.toString(),
    artMedium: painting.medium,
    width: painting.dimensions,
    description: painting.description,
    creator: { "@type": "Organization", name: STORE.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: painting.priceUSD.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <nav className="text-sm text-ink/60 dark:text-canvas/60 mb-6">
        <a href="/" className="hover:text-ink dark:hover:text-canvas">
          ← {STORE.name}
        </a>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <PaintingCard painting={painting} />
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-ink/60 dark:text-canvas/60">
            {painting.medium}
          </div>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">
            {painting.title}
          </h1>
          <div className="mt-1 text-ink/60 dark:text-canvas/60">{painting.year}</div>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <Meta label="Dimensions" value={painting.dimensions} />
            <Meta label="Provenance" value={painting.provenance} />
            <Meta label="Price" value={`$${painting.priceUSD.toFixed(2)}`} />
          </dl>
          <p className="mt-6 text-ink/80 dark:text-canvas/80 leading-relaxed">
            {painting.description}
          </p>
          <div className="mt-6 rounded-xl border border-ink/15 dark:border-canvas/15 bg-canvas/60 dark:bg-white/5 p-4 text-xs text-ink/70 dark:text-canvas/70">
            <div className="font-mono">GET /api/image/{painting.id}</div>
            <div className="mt-1">
              Returns <span className="font-mono">402 Payment Required</span>{" "}
              with x402 challenge until <span className="font-mono">X-Payment</span>{" "}
              header is presented.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 dark:border-canvas/10 bg-white/60 dark:bg-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-ink/50 dark:text-canvas/50">
        {label}
      </div>
      <div className="mt-1 text-ink/90 dark:text-canvas/90">{value}</div>
    </div>
  );
}
