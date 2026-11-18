<script setup lang="ts">
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { findProject, img, nextProject } from '~/data/projects';

const route = useRoute();
const project = findProject(String(route.params.slug));
if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true });
const next = nextProject(project.slug);

useSeoMeta({
  title: `${project.title} | Atelier Norte`,
  description: project.summary,
  ogImage: img(project.cover, 1200),
});

const root = ref<HTMLElement>();
const heroImg = ref<HTMLImageElement>();
const heroTitle = ref<HTMLElement>();
const track = ref<HTMLElement>();
const trackWrap = ref<HTMLElement>();
const nextImg = ref<HTMLImageElement>();
useRevealAnimations(root);

const expandTo = useExpandTo();
function openNext(e: MouseEvent) {
  if (e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  expandTo(nextImg.value, `/projects/${next.slug}`);
}

let ctx: gsap.Context | undefined;
let drag: Draggable[] = [];
onMounted(async () => {
  const { $reduce, $lenis } = useNuxtApp();

  // Arrived via the expanding image: wait for the real hero photo, then dissolve the clone into it.
  const clone = document.getElementById('fx-clone');
  if (clone) {
    await heroImg.value?.decode().catch(() => {});
    gsap.to(clone, { opacity: 0, duration: 0.6, delay: 0.1, onComplete: () => { clone.remove(); $lenis?.start(); } });
  } else {
    $lenis?.start();
  }

  // Drag-to-scroll gallery with momentum (works with mouse and touch).
  const bounds = () => ({ minX: Math.min(0, trackWrap.value!.clientWidth - track.value!.scrollWidth), maxX: 0 });
  drag = Draggable.create(track.value!, {
    type: 'x', bounds: bounds(), inertia: true, edgeResistance: 0.85, cursor: 'grab', activeCursor: 'grabbing',
    onPress() { this.applyBounds(bounds()); },
  });

  if ($reduce) return;
  await document.fonts.ready;
  ctx = gsap.context(() => {
    const s = SplitText.create(heroTitle.value!, { type: 'chars,lines', mask: 'lines', linesClass: 'split-line' });
    gsap.set(heroTitle.value!, { visibility: 'visible' });
    gsap.from(s.chars, { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.035, delay: clone ? 0.4 : 0.9 });
    gsap.from('.hero-meta > *', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', stagger: 0.08, delay: clone ? 0.7 : 1.2 });
    if (!clone) gsap.from(heroImg.value!, { scale: 1.2, duration: 2.2, ease: 'expo.out', delay: 0.4 });
    gsap.to(heroImg.value!, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: heroImg.value!.parentElement, start: 'top top', end: 'bottom top', scrub: true } });

    // Floor plan draws itself as it scrolls into view.
    gsap.fromTo('.plan-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', stagger: 0.05, scrollTrigger: { trigger: '.plan', start: 'top 80%', end: 'bottom 60%', scrub: true } });
    gsap.from('.plan-label', { opacity: 0, y: 8, stagger: 0.1, scrollTrigger: { trigger: '.plan', start: 'center 70%' } });

    // Gallery slides in from the right.
    gsap.from('.gal-item', { xPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: trackWrap.value, start: 'top 80%' } });
  }, root.value);
  ScrollTrigger.refresh();
});
onBeforeUnmount(() => { ctx?.revert(); drag.forEach((d) => d.kill()); document.getElementById('fx-clone')?.remove(); });
</script>

<template>
  <main ref="root">
    <!-- Hero -->
    <section class="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-paper">
      <img ref="heroImg" :src="img(project!.cover, 2000)" :alt="project!.title" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />
      <div class="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-10 sm:px-10 sm:pb-14">
        <p class="label text-paper/70">{{ project!.category }}</p>
        <h1 ref="heroTitle" data-split class="mt-4 font-display text-[17vw] leading-[0.85] font-light tracking-[-0.03em] sm:text-[11vw]">{{ project!.title }}</h1>
        <dl class="hero-meta mt-8 grid grid-cols-2 gap-6 border-t border-paper/25 pt-6 sm:grid-cols-4">
          <div><dt class="label text-paper/50">Location</dt><dd class="mt-1">{{ project!.location }}</dd></div>
          <div><dt class="label text-paper/50">Year</dt><dd class="mt-1">{{ project!.year }}</dd></div>
          <div><dt class="label text-paper/50">Area</dt><dd class="mt-1">{{ project!.area }}</dd></div>
          <div><dt class="label text-paper/50">Type</dt><dd class="mt-1">{{ project!.category }}</dd></div>
        </dl>
      </div>
    </section>

    <!-- Overview -->
    <section class="mx-auto grid max-w-[1600px] gap-12 px-5 py-28 sm:px-10 md:grid-cols-12 md:py-40">
      <p class="label text-bronze md:col-span-3">Overview</p>
      <div class="md:col-span-9">
        <p data-split class="font-display text-4xl leading-[1.1] font-light sm:text-6xl">{{ project!.summary }}</p>
        <div class="mt-14 grid gap-8 text-ink-2 md:grid-cols-2">
          <p v-for="(para, i) in project!.body" :key="i" data-fade class="leading-relaxed">{{ para }}</p>
        </div>
      </div>
    </section>

    <!-- Drag gallery -->
    <section class="pb-28 md:pb-40">
      <div class="mx-auto flex max-w-[1600px] items-end justify-between px-5 sm:px-10">
        <p class="label text-bronze">Gallery</p>
        <p class="label text-ink/50">Drag ⟷</p>
      </div>
      <div ref="trackWrap" class="mt-8 overflow-hidden">
        <div ref="track" class="flex w-max gap-4 px-5 sm:gap-6 sm:px-10">
          <figure v-for="(g, i) in project!.gallery" :key="g + i" class="gal-item m-0 shrink-0 overflow-hidden rounded-sm" :class="i % 2 ? 'w-[70vw] sm:w-[34vw]' : 'w-[85vw] sm:w-[48vw]'">
            <img :src="img(g, 1400)" :alt="`${project!.title}, view ${i + 1}`" draggable="false" loading="lazy" class="h-[58svh] w-full select-none object-cover" />
          </figure>
        </div>
      </div>
    </section>

    <!-- Floor plan -->
    <section class="bg-stone">
      <div class="mx-auto grid max-w-[1600px] gap-12 px-5 py-28 sm:px-10 md:grid-cols-12 md:py-40">
        <div class="md:col-span-4">
          <p class="label text-bronze">Ground floor</p>
          <h2 data-split class="mt-6 font-display text-5xl leading-[0.95] font-light sm:text-7xl">The <em>plan.</em></h2>
          <p data-fade class="mt-6 max-w-sm text-ink-2">Living spaces open to the south and the garden; private rooms gather on the quiet north side.</p>
        </div>
        <svg class="plan md:col-span-8" viewBox="0 0 620 400" fill="none" stroke="currentColor" stroke-linecap="round" aria-label="Simplified ground floor plan">
          <path class="plan-line" stroke-width="5" pathLength="1" stroke-dasharray="1" d="M20 20H600V380H20Z" />
          <path class="plan-line" stroke-width="2.5" pathLength="1" stroke-dasharray="1" d="M260 20V170M260 230V380" />
          <path class="plan-line" stroke-width="2.5" pathLength="1" stroke-dasharray="1" d="M20 220H120M170 220H260" />
          <path class="plan-line" stroke-width="2.5" pathLength="1" stroke-dasharray="1" d="M430 20V140M430 190V250H600" />
          <path class="plan-line" stroke-width="1.5" pathLength="1" stroke-dasharray="1" d="M120 220A50 50 0 0 1 170 170M260 170A60 60 0 0 1 320 230M430 140A50 50 0 0 0 480 190" />
          <path class="plan-line text-bronze" stroke-width="1.5" pathLength="1" stroke-dasharray="1" d="M300 280H560V350H300Z" />
          <path class="plan-line" stroke-width="1.5" pathLength="1" stroke-dasharray="1" d="M60 60H200V110H60ZM460 60H570V110H460Z" />
          <g class="font-sans" fill="currentColor" stroke="none" font-size="12" letter-spacing="2">
            <text class="plan-label" x="70" y="150">BEDROOM</text>
            <text class="plan-label" x="70" y="300">STUDY</text>
            <text class="plan-label" x="300" y="110">LIVING</text>
            <text class="plan-label" x="470" y="160">KITCHEN</text>
            <text class="plan-label fill-bronze" x="470" y="320">POOL</text>
          </g>
        </svg>
      </div>
    </section>

    <!-- Next project -->
    <a :href="`/projects/${next.slug}`" class="group relative block h-[80svh] overflow-hidden bg-ink text-paper" @click="openNext">
      <img ref="nextImg" :src="img(next.cover, 2000)" :alt="next.title" loading="lazy"
           class="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:opacity-90" />
      <div class="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
      <div class="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-12 sm:px-10">
        <p class="label text-paper/70">Next project →</p>
        <p class="mt-4 font-display text-[16vw] leading-[0.85] font-light transition-transform duration-700 group-hover:translate-x-4 sm:text-[9vw]">{{ next.title }}</p>
      </div>
    </a>
    <AppFooter />
  </main>
</template>
