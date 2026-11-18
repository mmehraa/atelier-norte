<script setup lang="ts">
import { gsap } from 'gsap';
import { img } from '~/data/projects';

/* Pinned section: as you scroll, each step's text swaps and its photo wipes up over the last one. */
const steps = [
  { n: '01', title: 'Listen', text: 'We start at your kitchen table, not ours. How you wake up, where the light falls, what you want to leave behind.', img: '1667312939978-64cf31718a6e' },
  { n: '02', title: 'Draw', text: 'Hand sketches first, then models you can hold and walk through in VR. Nothing is fixed until it feels right.', img: '1601993957728-1e56ab70c5a8' },
  { n: '03', title: 'Build', text: 'We stay on site with local builders until the last detail is done, and come back a year later to check in.', img: '1774311237295-a65a4c1ff38a' },
];
const root = ref<HTMLElement>();
let ctx: gsap.Context | undefined;
onMounted(() => {
  const { $reduce } = useNuxtApp();
  if ($reduce) return;
  ctx = gsap.context(() => {
    const texts = gsap.utils.toArray<HTMLElement>('.step-text');
    const imgs = gsap.utils.toArray<HTMLElement>('.step-img');
    gsap.set(texts.slice(1), { yPercent: 40, opacity: 0 });
    gsap.set(imgs.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top top', end: '+=220%', pin: true, scrub: 1 } });
    for (let i = 1; i < steps.length; i++) {
      tl.to(texts[i - 1]!, { yPercent: -40, opacity: 0, duration: 0.5 }, i)
        .to(texts[i]!, { yPercent: 0, opacity: 1, duration: 0.5 }, i + 0.3)
        .to(imgs[i]!, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, i - 0.1)
        .fromTo(imgs[i]!.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 1, ease: 'power2.out' }, i - 0.1)
        .to('.step-progress', { scaleY: (i + 1) / steps.length, duration: 1 }, i - 0.1);
    }
    tl.to({}, { duration: 0.6 });
  }, root.value);
});
onBeforeUnmount(() => ctx?.revert());
</script>

<template>
  <section id="approach" ref="root" class="relative bg-ink text-paper">
    <div class="mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-10 px-5 py-24 sm:px-10 md:grid-cols-2 md:gap-20 md:py-0">
      <div>
        <p class="label text-bronze">(03) How we work</p>
        <div class="relative mt-10 flex gap-8">
          <div class="relative w-px shrink-0 bg-paper/20">
            <span class="step-progress absolute inset-0 origin-top scale-y-[.334] bg-bronze" />
          </div>
          <div class="grid">
            <div v-for="s in steps" :key="s.n" class="step-text [grid-area:1/1]">
              <p class="font-display text-8xl font-light text-bronze sm:text-9xl">{{ s.n }}</p>
              <h3 class="mt-2 font-display text-5xl font-light italic sm:text-7xl">{{ s.title }}</h3>
              <p class="mt-6 max-w-md text-paper/70">{{ s.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="relative aspect-[4/5] max-h-[78svh] w-full overflow-hidden rounded-sm md:justify-self-end">
        <div v-for="s in steps" :key="s.n" class="step-img absolute inset-0 overflow-hidden">
          <img :src="img(s.img, 1200)" :alt="s.title" loading="lazy" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </section>
</template>
