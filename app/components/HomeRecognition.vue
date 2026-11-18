<script setup lang="ts">
const awards = [
  { year: 2025, name: 'Iberian Architecture Prize', project: 'Lumen Pavilion', result: 'Winner' },
  { year: 2025, name: 'Habitat Design Awards: Interiors', project: 'Atrium Loft', result: 'Gold' },
  { year: 2024, name: 'Quiet Spaces Review', project: 'Pinar House', result: 'Featured' },
  { year: 2024, name: 'Atlantic Building of the Year', project: 'Casa Alba', result: 'Shortlist' },
  { year: 2023, name: 'Young Practice Award', project: 'Atelier Norte', result: 'Winner' },
];
</script>

<template>
  <section class="mx-auto max-w-[1600px] px-5 py-28 sm:px-10 md:py-44">
    <p class="label text-bronze">(04) Recognition</p>
    <h2 data-split class="mt-6 font-display text-6xl leading-[0.9] font-light sm:text-8xl">Kind words <em>from others.</em></h2>
    <ul class="mt-16 border-t border-ink/15">
      <li v-for="a in awards" :key="a.name" data-fade
          class="row group relative grid grid-cols-[4rem_1fr] gap-x-6 gap-y-1 border-b border-ink/15 py-7 sm:grid-cols-[6rem_2fr_1fr_8rem] sm:items-center">
        <span class="label relative z-10 text-ink/50 transition-colors duration-500 group-hover:text-paper/60">{{ a.year }}</span>
        <span class="relative z-10 font-display text-2xl font-light transition-all duration-500 group-hover:translate-x-3 group-hover:text-paper sm:text-4xl">{{ a.name }}</span>
        <span class="relative z-10 col-start-2 text-sm text-ink/60 transition-colors duration-500 group-hover:text-paper/70 sm:col-start-auto">{{ a.project }}</span>
        <span class="label relative z-10 col-start-2 text-bronze sm:col-start-auto sm:text-right">{{ a.result }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* A dark band rises from the bottom of each row on hover. */
.row::before { content: ""; position: absolute; inset: 0 -1.25rem; background: var(--color-ink); transform: scaleY(0); transform-origin: bottom; transition: transform .6s cubic-bezier(.22, 1, .36, 1); }
.row:hover::before { transform: scaleY(1); }
</style>
