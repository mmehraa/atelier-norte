import type { RouterConfig } from '@nuxt/schema';

// Scrolling is handled by the page transition in app.vue (so the page never jumps mid-animation).
export default <RouterConfig>{
  scrollBehavior: () => false,
};
