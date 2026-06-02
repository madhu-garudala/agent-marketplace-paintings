import type { Metadata } from "next";
import "./globals.css";
import { STORE, paintings } from "@/data/paintings";

const description = `${STORE.tagline} ${paintings.length} rare paintings — agent-discoverable catalog, x402 micropayments.`;

export const metadata: Metadata = {
  title: `${STORE.name} — Rare paintings by ${STORE.owner}`,
  description,
  openGraph: {
    title: STORE.name,
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: STORE.name, description },
  other: {
    "agent-card": "/.well-known/agent.json",
    "x-payment-protocol": "x402",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="application/json"
          title="Agent Card"
          href="/.well-known/agent.json"
        />
        <link
          rel="alternate"
          type="application/json"
          title="Painting Catalog"
          href="/api/paintings"
        />
        <link
          rel="alternate"
          type="text/markdown"
          title="Agent Manifest (Markdown)"
          href="/.well-known/agents.md"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('vgp:theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-serif min-h-screen paper bg-canvas text-ink dark:bg-[#0e0d0b] dark:text-[#ece6d6]">
        {children}
      </body>
    </html>
  );
}
