<script setup lang="ts">
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories, img, projects, type Category } from '~/data/projects';

/*
  Filterable project grid. Changing the filter records every card's position, updates the DOM,
  then GSAP Flip animates each card from where it was to where it is now.
*/
const filter = ref<Category | 'All'>('All');
const grid = ref<HTMLElement>();
const count = (c: Category | 'All') => (c === 'All' ? projects.length : projects.filter((p) => p.category === c).length);
const visible = (c: Category) => filter.value === 'All' || filter.value === c;
// Right-hand column sits lower for a staggered, editorial layout (based on position among visible cards).
const offset = (slug: string) => projects.filter((p) => visible(p.category)).findIndex((p) => p.slug === slug) % 2 === 1;

function setFilter(c: Category | 'All') {
  if (c === filter.value) return;
  const { $reduce } = useNuxtApp();
  const cards = grid.value!.querySelectorAll('.work-card');
  const state = Flip.getState(cards);
  filter.value = c;
  nextTick(() => {
    if ($reduce) return ScrollTrigger.refresh();
    Flip.from(state, {
      duration: 0.9, ease: 'expo.inOut', absolute: true, stagger: 0.03, scale: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.5, ease: 'power3.in' }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  });
}

// A round "View" badge follows the cursor inside each card.
const fine = ref(false);
onMounted(() => { fine.value = window.matchMedia('(pointer: fine)').matches; });
function move(e: PointerEvent) {
  const card = e.currentTarget as HTMLElement;
  const badge = card.querySelector<HTMLElement>('.view-badge');
  const r = card.getBoundingClientRect();
  if (badge) gsap.to(badge, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.6, ease: 'power3.out' });
}

const expandTo = useExpandTo();
function open(e: MouseEvent, slug: string) {
  if (e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  const image = (e.currentTarget as HTMLElement).querySelector('img');
  expandTo(image, `/projects/${slug}`);
}
</script>

<template>
  <section id="work" class="mx-auto max-w-[1600px] px-5 pb-28 sm:px-10 md:pb-48">
    <div class="flex flex-wrap items-end justify-between gap-8 border-b border-ink/15 pb-8">
      <div>
        <p class="label text-bronze">(02) Selected work</p>
        <h2 data-split class="mt-6 font-display text-6xl leading-[0.9] font-light sm:text-8xl">Built &amp; <em>lived in.</em></h2>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filter projects">
        <button v-for="c in (['All', ...categories] as const)" :key="c" class="label relative pb-1 transition-colors"
                :class="filter === c ? 'text-ink' : 'text-ink/40 hover:text-ink'" :aria-pressed="filter === c" @click="setFilter(c)">
          {{ c }} <sup class="text-bronze">{{ count(c) }}</sup>
          <span class="absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-500" :class="filter === c ? 'scale-x-100' : 'scale-x-0'" />
        </button>
      </div>
    </div>

    <div ref="grid" class="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-24">
      <a v-for="(p, i) in projects" v-show="visible(p.category)" :key="p.slug" :href="`/projects/${p.slug}`"
         class="work-card group block" :class="offset(p.slug) ? 'md:mt-32' : ''"
         @click="open($event, p.slug)" @pointermove="fine && move($event)">
        <div class="relative overflow-hidden rounded-sm" :class="i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[5/4]'">
          <img :src="img(p.cover, 1200)" :alt="p.title" loading="lazy"
               class="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
          <span v-if="fine" class="view-badge pointer-events-none absolute left-0 top-0 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 place-items-center rounded-full bg-paper text-ink label transition-transform duration-500 group-hover:scale-100">View</span>
        </div>
        <div class="mt-5 flex items-baseline justify-between gap-4">
          <h3 class="font-display text-3xl font-light sm:text-4xl">{{ p.title }}</h3>
          <span class="label text-ink/50">{{ p.year }}</span>
        </div>
        <p class="mt-1 text-sm text-ink/60">{{ p.category }} · {{ p.location }}</p>
      </a>
    </div>
  </section>
</template>
