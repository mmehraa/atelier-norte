<script setup lang="ts">
const open = ref(false);
const route = useRoute();
const links = [
  { label: 'Work', hash: '#work' },
  { label: 'Approach', hash: '#approach' },
  { label: 'Studio', hash: '#studio' },
  { label: 'Contact', hash: '#contact' },
];

// On the home page, glide to the section. Elsewhere, go home first and let the page scroll to it.
async function go(hash: string) {
  open.value = false;
  const { $lenis } = useNuxtApp();
  if (route.path === '/') {
    const el = document.querySelector(hash);
    if (el) $lenis ? $lenis.scrollTo(el as HTMLElement, { duration: 1.6 }) : el.scrollIntoView();
  } else {
    await navigateTo({ path: '/', hash });
  }
}
watch(open, (v) => { const { $lenis } = useNuxtApp(); v ? $lenis?.stop() : $lenis?.start(); });
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 text-paper mix-blend-difference">
    <div class="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-10">
      <NuxtLink to="/" class="font-display text-2xl tracking-tight" @click="open = false">Atelier <em class="font-light">Norte</em></NuxtLink>
      <nav class="hidden gap-10 md:flex" aria-label="Main">
        <a v-for="l in links" :key="l.hash" :href="`/${l.hash}`" class="label link-line pb-1" @click.prevent="go(l.hash)">{{ l.label }}</a>
      </nav>
      <button class="label md:hidden" :aria-expanded="open" aria-controls="menu" @click="open = !open">{{ open ? 'Close' : 'Menu' }}</button>
    </div>
  </header>
  <Transition name="menu">
    <nav v-if="open" id="menu" class="fixed inset-0 z-40 flex flex-col justify-end gap-2 bg-ink px-5 pb-16 text-paper md:hidden" aria-label="Mobile">
      <a v-for="l in links" :key="l.hash" :href="`/${l.hash}`" class="font-display text-6xl font-light" @click.prevent="go(l.hash)">{{ l.label }}</a>
      <p class="mt-10 text-sm text-paper/60">hello@ateliernorte.example<br />Rua das Flores 112, Porto</p>
    </nav>
  </Transition>
</template>

<style scoped>
.menu-enter-active, .menu-leave-active { transition: clip-path .7s cubic-bezier(.77, 0, .18, 1); }
.menu-enter-from, .menu-leave-to { clip-path: inset(0 0 100% 0); }
.menu-enter-to, .menu-leave-from { clip-path: inset(0 0 0 0); }
</style>
