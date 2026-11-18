<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { findProject } from '~/data/projects';

const fx = useRouteFx();
const curtain = ref<HTMLElement>();
const curtainLabel = ref('Atelier Norte');
const router = useRouter();

// Show the destination's name on the curtain while it covers the screen.
router.beforeEach((to) => {
  curtainLabel.value = findProject(String(to.params.slug ?? ''))?.title ?? 'Atelier Norte';
});

const toTop = () => {
  const { $lenis } = useNuxtApp();
  $lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
};

function onLeave(el: Element, done: () => void) {
  if (fx.value === 'expand') {
    gsap.to(el, { opacity: 0, duration: 0.25, onComplete: done });
    return;
  }
  gsap.timeline({ onComplete: done })
    .set(curtain.value!, { display: 'flex', clipPath: 'inset(100% 0% 0% 0%)' })
    .to(curtain.value!, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'expo.inOut' })
    .fromTo('.curtain-label', { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, 0.35);
}

function onEnter(_el: Element, done: () => void) {
  toTop();
  nextTick(() => ScrollTrigger.refresh());
  if (fx.value === 'expand') {
    fx.value = 'curtain';
    done();
    return;
  }
  gsap.timeline({ onComplete: () => { gsap.set(curtain.value!, { display: 'none' }); useNuxtApp().$lenis?.start(); done(); } })
    .to('.curtain-label', { yPercent: -100, duration: 0.5, ease: 'expo.in' }, 0.1)
    .to(curtain.value!, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, 0.3);
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtPage :transition="{ mode: 'out-in', css: false, onLeave, onEnter }" />
    <div ref="curtain" class="fixed inset-0 z-[90] hidden items-end bg-ink p-6 text-paper sm:p-12" aria-hidden="true">
      <div class="overflow-hidden">
        <p class="curtain-label font-display text-[14vw] leading-none font-light italic sm:text-[9vw]">{{ curtainLabel }}</p>
      </div>
    </div>
  </div>
</template>
