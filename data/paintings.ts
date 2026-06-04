export type Painting = {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  provenance: string;
  description: string;
  priceUSD: number;
  // picsum seed used to render the protected image; replace with real asset URLs later
  imageSeed: string;
  // Optional: path under /public to serve as the real image (overrides picsum).
  imageFile?: string;
};

export const STORE = {
  name: "Van Gogh Paintings",
  owner: "Madhu Garudala",
  tagline: "A private collection of rare and unique post-impressionist works.",
  location: "Online",
  contact: "madhu.garudala@gmail.com",
};

export const paintings: Painting[] = [
  {
    id: "starlit-orchard",
    title: "Starlit Orchard",
    year: 1889,
    medium: "Oil on canvas",
    dimensions: "73 x 92 cm",
    provenance: "Private collection, Arles",
    description:
      "A swirling, cobalt-drenched orchard under a night sky thick with stars — brushwork so dense the canvas reads like sculpture.",
    priceUSD: 0.08,
    imageSeed: "vg-starlit-orchard",
  },
  {
    id: "yellow-house-rain",
    title: "The Yellow House in Rain",
    year: 1888,
    medium: "Oil on canvas",
    dimensions: "60 x 76 cm",
    provenance: "Estate of Auguste Mercier",
    description:
      "A rare wet-weather study of the famous Yellow House — ochre walls bleeding into a wash of cool grey.",
    priceUSD: 0.03,
    imageSeed: "vg-yellow-house-rain",
  },
  {
    id: "wheatfield-with-larks",
    title: "Wheatfield with Larks",
    year: 1890,
    medium: "Oil on canvas",
    dimensions: "50 x 100 cm",
    provenance: "Auvers-sur-Oise, private holding",
    description:
      "Horizontal field of cadmium yellow with darting birds — one of the last open-air compositions.",
    priceUSD: 0.07,
    imageSeed: "vg-wheatfield-larks",
  },
  {
    id: "self-portrait-blue",
    title: "Self-Portrait in Blue",
    year: 1889,
    medium: "Oil on canvas",
    dimensions: "65 x 54 cm",
    provenance: "Saint-Rémy archives",
    description:
      "Severe, ultramarine self-study with rippling background — unflinching gaze, scarred ear concealed.",
    priceUSD: 0.10,
    imageSeed: "vg-self-portrait-blue",
  },
  {
    id: "almond-blossom-study",
    title: "Almond Blossom (Study)",
    year: 1890,
    medium: "Oil on canvas",
    dimensions: "73 x 92 cm",
    provenance: "Theo van Gogh estate (unverified)",
    description:
      "Preparatory study for the celebrated Almond Blossom — looser, more violent in its joy.",
    priceUSD: 0.06,
    imageSeed: "vg-almond-blossom",
  },
  {
    id: "cafe-terrace-dawn",
    title: "Café Terrace at Dawn",
    year: 1888,
    medium: "Oil on canvas",
    dimensions: "81 x 65 cm",
    provenance: "Arles, private",
    description:
      "Companion piece to the famous night terrace — first light hitting the awnings, chairs still upturned.",
    priceUSD: 0.02,
    imageSeed: "vg-cafe-dawn",
  },
  {
    id: "bedroom-second-version",
    title: "Bedroom (Second Version)",
    year: 1889,
    medium: "Oil on canvas",
    dimensions: "72 x 90 cm",
    provenance: "Saint-Rémy, private",
    description:
      "Re-painted from memory at the asylum — colors more saturated, perspective steeper, intimate to the point of vertigo.",
    priceUSD: 0.09,
    imageSeed: "vg-bedroom-2",
  },
  {
    id: "irises-at-twilight",
    title: "Irises at Twilight",
    year: 1889,
    medium: "Oil on canvas",
    dimensions: "71 x 93 cm",
    provenance: "Saint-Paul-de-Mausole garden series",
    description:
      "Violet irises tilting against a chartreuse ground — painted in a single sitting before the light failed.",
    priceUSD: 0.04,
    imageSeed: "vg-irises-twilight",
  },
  {
    id: "old-mill-zundert",
    title: "Old Mill at Zundert",
    year: 1885,
    medium: "Oil on board",
    dimensions: "40 x 55 cm",
    provenance: "Brabant private collection",
    description:
      "An earthen, Nuenen-period study — heavy impasto, the palette still tied to the Dutch masters.",
    priceUSD: 0.01,
    imageSeed: "vg-old-mill",
  },
  {
    id: "sower-with-setting-sun",
    title: "Sower with Setting Sun",
    year: 1888,
    medium: "Oil on canvas",
    dimensions: "73 x 92 cm",
    provenance: "Arles, private",
    description:
      "After Millet, transfigured — molten sun behind a striding silhouette, the field combed in citron strokes.",
    priceUSD: 0.08,
    imageSeed: "vg-sower-sunset",
  },
  {
    id: "fishing-boats-saintes-maries",
    title: "Fishing Boats, Saintes-Maries",
    year: 1888,
    medium: "Oil on canvas",
    dimensions: "44 x 53 cm",
    provenance: "Mediterranean coast study",
    description:
      "Four bright hulls beached on pale sand — masts striking the sky like fence posts.",
    priceUSD: 0.02,
    imageSeed: "vg-fishing-boats",
  },
  {
    id: "olive-trees-mistral",
    title: "Olive Trees in Mistral",
    year: 1889,
    medium: "Oil on canvas",
    dimensions: "72 x 92 cm",
    provenance: "Saint-Rémy",
    description:
      "Trees twisted by wind, painted from a fixed easel weighted with stones. Foliage like green flames.",
    priceUSD: 0.06,
    imageSeed: "vg-olive-mistral",
  },
  {
    id: "portrait-of-the-postmaster",
    title: "Portrait of the Postmaster",
    year: 1888,
    medium: "Oil on canvas",
    dimensions: "65 x 54 cm",
    provenance: "Roulin family descent",
    description:
      "A second sitting of Joseph Roulin — beard in burnt sienna, jacket in absolute Prussian blue.",
    priceUSD: 0.04,
    imageSeed: "vg-postmaster",
  },
  {
    id: "harvest-la-crau",
    title: "Harvest at La Crau",
    year: 1888,
    medium: "Oil on canvas",
    dimensions: "73 x 92 cm",
    provenance: "Provence, private",
    description:
      "Panoramic Provençal harvest — receding planes of gold, ochre, and tile-red roofs.",
    priceUSD: 0.09,
    imageSeed: "vg-harvest-la-crau",
  },
  {
    id: "night-cafe-billiards",
    title: "Night Café (Billiards)",
    year: 1888,
    medium: "Oil on canvas",
    dimensions: "70 x 89 cm",
    provenance: "Arles, private",
    description:
      "Variant of the Night Café — green table glowing under a single gas lamp, the room tilted with fatigue.",
    priceUSD: 0.07,
    imageSeed: "vg-night-cafe",
  },
  {
    id: "cypresses-mistral-sky",
    title: "Cypresses, Mistral Sky",
    year: 1889,
    medium: "Oil on canvas",
    dimensions: "93 x 74 cm",
    provenance: "Saint-Rémy",
    description:
      "Two cypresses rising like green flame, sky combed in horizontal silver strokes.",
    priceUSD: 0.10,
    imageSeed: "vg-cypresses",
  },
  {
    id: "still-life-with-quinces",
    title: "Still Life with Quinces",
    year: 1887,
    medium: "Oil on canvas",
    dimensions: "46 x 55 cm",
    provenance: "Paris period, private",
    description:
      "Yellow on yellow — quinces on a saffron cloth, a Parisian experiment in single-hue harmony.",
    priceUSD: 0.03,
    imageSeed: "vg-quinces",
  },
  {
    id: "bridge-at-langlois-evening",
    title: "Bridge at Langlois, Evening",
    year: 1888,
    medium: "Oil on canvas",
    dimensions: "54 x 65 cm",
    provenance: "Arles, private",
    description:
      "The drawbridge at last light — washerwomen gone, the wood blackening against a peach sky.",
    priceUSD: 0.05,
    imageSeed: "vg-langlois-evening",
  },
  {
    id: "peasant-woman-binding-sheaves",
    title: "Peasant Woman Binding Sheaves",
    year: 1889,
    medium: "Oil on canvas",
    dimensions: "43 x 33 cm",
    provenance: "After Millet, Saint-Rémy",
    description:
      "A monumental small canvas — the figure bent in arc, wheat tied like a body in repose.",
    priceUSD: 0.02,
    imageSeed: "vg-peasant-binding",
  },
  {
    id: "garden-of-asylum",
    title: "Garden of the Asylum",
    year: 1889,
    medium: "Oil on canvas",
    dimensions: "73 x 92 cm",
    provenance: "Saint-Paul-de-Mausole",
    description:
      "The walled garden in late afternoon — pines, a stone bench, a single patient walking the path.",
    priceUSD: 0.06,
    imageSeed: "vg-garden-asylum",
  },
];

export function findPainting(id: string): Painting | undefined {
  return paintings.find((p) => p.id === id);
}
