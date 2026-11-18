<script setup lang="ts">
const root = ref<HTMLElement>();
useRevealAnimations(root);

// Arriving from another page with a hash (e.g. /#contact): glide to that section once the page is in.
const route = useRoute();
onMounted(() => {
  if (!route.hash) return;
  setTimeout(() => {
    const el = document.querySelector(route.hash);
    const { $lenis } = useNuxtApp();
    if (el) $lenis ? $lenis.scrollTo(el as HTMLElement, { duration: 1.6 }) : el.scrollIntoView();
  }, 1200);
});
</script>

<template>
  <main ref="root">
    <HeroSlider />
    <HomeStatement />
    <WorkIndex />
    <HomeApproach />
    <HomeRecognition />
    <HomeContact />
    <AppFooter />
  </main>
</template>
