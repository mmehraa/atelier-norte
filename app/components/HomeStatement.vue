<script setup lang="ts">
import { gsap } from 'gsap';
import { img } from '~/data/projects';

/* A sentence with small photos tucked inline. As you scroll, the photos open up between the words. */
const root = ref<HTMLElement>();
let ctx: gsap.Context | undefined;
onMounted(() => {
  const { $reduce } = useNuxtApp();
  if ($reduce) return;
  ctx = gsap.context(() => {
    gsap.fromTo('.inline-img', { width: 0, marginInline: 0 }, {
      width: '2.1em', marginInline: '0.12em', ease: 'none', stagger: 0.15,
      scrollTrigger: { trigger: root.value, start: 'top 85%', end: 'center 55%', scrub: true },
    });
    gsap.fromTo('.inline-img img', { scale: 1.6 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top 85%', end: 'center 55%', scrub: true } });
  }, root.value);
});
onBeforeUnmount(() => ctx?.revert());
</script>

<template>
  <section id="studio" ref="root" class="mx-auto max-w-[1600px] px-5 py-28 sm:px-10 md:py-48">
    <p class="label text-bronze">(01) The studio</p>
    <p class="mt-10 font-display text-[10vw] leading-[1.02] font-light tracking-[-0.02em] sm:text-[6.4vw]">
      We design
      <span class="inline-img"><img :src="img('1698994705178-d244d73ea573', 300)" alt="" /></span>
      quiet homes,
      <span class="inline-img"><img :src="img('1583329550487-0fa300a4cd1a', 300)" alt="" /></span>
      calm <em>interiors</em> and places
      <span class="inline-img"><img :src="img('1660361338517-8c8fbb3ac264', 300)" alt="" /></span>
      to slow down.
    </p>
    <div class="mt-16 grid gap-10 border-t border-ink/15 pt-10 text-ink-2 md:grid-cols-3">
      <p class="text-sm leading-relaxed">Founded in Porto in 2012 by architects Inês Duarte and Tomás Reis. Eleven people, one long table, no rush.</p>
      <p class="text-sm leading-relaxed">We take on a handful of projects each year (homes, interiors and small hospitality) and see each one through from first sketch to the last door handle.</p>
      <p class="text-sm leading-relaxed">Our work is shaped by light, local materials and the way people actually live. Nothing more than it needs to be.</p>
    </div>
  </section>
</template>

<style scoped>
.inline-img { display: inline-block; width: 2.1em; height: 0.82em; margin-inline: 0.12em; vertical-align: -0.06em; overflow: hidden; border-radius: 999px; }
.inline-img img { width: 100%; height: 100%; object-fit: cover; }
</style>
