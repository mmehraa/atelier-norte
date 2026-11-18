// Studio portfolio content. Swap these entries to adapt the site for a real client.

export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type Category = 'Residential' | 'Interior' | 'Hospitality';

export interface Project {
  slug: string;
  title: string;
  category: Category;
  location: string;
  year: number;
  area: string;
  cover: string;
  gallery: string[];
  summary: string;
  body: string[];
}

export const categories: Category[] = ['Residential', 'Interior', 'Hospitality'];

export const projects: Project[] = [
  {
    slug: 'lumen-pavilion', title: 'Lumen Pavilion', category: 'Hospitality', location: 'Comporta, PT', year: 2025, area: '640 m²',
    cover: '1748063578185-3d68121b11ff',
    gallery: ['1748063578185-3d68121b11ff', '1774311237295-a65a4c1ff38a', '1609081144289-eacc3108cd03', '1583329550487-0fa300a4cd1a'],
    summary: 'A guest pavilion that glows like a lantern at dusk, opening entirely to the pine forest.',
    body: [
      'Lumen sits low among umbrella pines, a single horizontal plane of timber and glass. During the day it almost disappears; at night it becomes a lantern for the whole estate.',
      'Every room opens on two sides, so guests wake to forest on one side and the pool on the other. Materials are few and honest: oak, lime plaster, and travertine worn soft underfoot.',
    ],
  },
  {
    slug: 'pinar-house', title: 'Pinar House', category: 'Residential', location: 'Sintra, PT', year: 2024, area: '410 m²',
    cover: '1698994705178-d244d73ea573',
    gallery: ['1698994705178-d244d73ea573', '1758565811176-ccd94357a844', '1601993957728-1e56ab70c5a8', '1758565811178-6341e9999f48'],
    summary: 'A family home that steps down a granite hillside, built around the trees that were already there.',
    body: [
      'Rather than flatten the site, Pinar follows it. Three volumes step down the slope, each turned slightly to frame a different view of the valley.',
      'The existing cork oaks set the plan: rooms bend around them, and a long stone stair links every level to the garden.',
    ],
  },
  {
    slug: 'casa-alba', title: 'Casa Alba', category: 'Residential', location: 'Cascais, PT', year: 2024, area: '520 m²',
    cover: '1613490493576-7fde63acd811',
    gallery: ['1613490493576-7fde63acd811', '1583847268964-b28dc8f51f92', '1724582586529-62622e50c0b3', '1605774337664-7a846e9cdf17'],
    summary: 'White walls, deep shade and a long pool that carries the light into the living room.',
    body: [
      'Casa Alba is a study in shade. Deep timber overhangs keep the Atlantic sun off the glass while letting the light bounce in from the pool.',
      'Inside, the palette is restrained so the view does the work: limewashed walls, pale oak and linen.',
    ],
  },
  {
    slug: 'atrium-loft', title: 'Atrium Loft', category: 'Interior', location: 'Porto, PT', year: 2025, area: '180 m²',
    cover: '1583329550487-0fa300a4cd1a',
    gallery: ['1583329550487-0fa300a4cd1a', '1667312939978-64cf31718a6e', '1758974782657-e5ada4b01c3c', '1532204182725-d0f67855ac87'],
    summary: 'A former textile warehouse turned into a light-filled home for a ceramicist and her family.',
    body: [
      'We kept the warehouse bones (the iron columns, the tall windows) and inserted a single oak "furniture wall" that holds the kitchen, storage and a hidden studio.',
      'The result is one generous room that changes through the day as the light moves across it.',
    ],
  },
  {
    slug: 'cubo-studio', title: 'Cubo Studio', category: 'Residential', location: 'Braga, PT', year: 2023, area: '260 m²',
    cover: '1628012209120-d9db7abf7eab',
    gallery: ['1628012209120-d9db7abf7eab', '1598911096723-af003b4ea77a', '1567016376408-0226e4d0c1ea', '1784790601988-7915393bc5a1'],
    summary: 'Two stacked white boxes, slightly rotated to catch both the morning and the evening sun.',
    body: [
      'Cubo answers a tight suburban plot with a simple move: two volumes, the upper one rotated eleven degrees to escape the neighbours and find the sun.',
      'The twist creates a sheltered terrace below and a cantilevered reading room above.',
    ],
  },
  {
    slug: 'villa-mar', title: 'Villa Mar', category: 'Residential', location: 'Algarve, PT', year: 2023, area: '480 m²',
    cover: '1633354747567-e0682586f082',
    gallery: ['1633354747567-e0682586f082', '1774311237295-a65a4c1ff38a', '1605774337664-7a846e9cdf17', '1724582586529-62622e50c0b3'],
    summary: 'A slatted pergola filters the southern light into stripes that move across the house all day.',
    body: [
      'The pergola is the whole idea. Its slats are angled to block the summer sun and admit the winter sun, so the house stays cool without air-conditioning for most of the year.',
      'Below it, living spaces flow straight onto the terrace and pool.',
    ],
  },
  {
    slug: 'quiet-apartment', title: 'Quiet Apartment', category: 'Interior', location: 'Lisbon, PT', year: 2024, area: '120 m²',
    cover: '1724582586529-62622e50c0b3',
    gallery: ['1724582586529-62622e50c0b3', '1667312939978-64cf31718a6e', '1532204182725-d0f67855ac87', '1758974782657-e5ada4b01c3c'],
    summary: 'A 1950s apartment reworked for a musician who wanted calm, not clutter.',
    body: [
      'Walls were removed, storage was hidden, and acoustic panels were disguised as limewashed plaster. The apartment now feels twice its size and sounds like a studio.',
      'A single built-in bench runs the length of the living room: seat, bookshelf and record cabinet in one.',
    ],
  },
  {
    slug: 'serra-retreat', title: 'Serra Retreat', category: 'Hospitality', location: 'Serra da Estrela, PT', year: 2025, area: '900 m²',
    cover: '1660361338517-8c8fbb3ac264',
    gallery: ['1660361338517-8c8fbb3ac264', '1784790601988-7915393bc5a1', '1609081144289-eacc3108cd03', '1583847268964-b28dc8f51f92'],
    summary: 'A twelve-room mountain retreat where every room faces the pool and the peaks beyond.',
    body: [
      'Serra is designed for doing nothing well. Rooms are small and calm; the shared spaces (pool, library, long dining table) are generous.',
      'Local schist and chestnut tie the building to its landscape, and a heated pool steams in the cold mountain mornings.',
    ],
  },
];

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length]!;
