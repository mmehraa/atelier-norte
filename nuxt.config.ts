// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Atelier Norte | Architecture & Interiors, Porto',
      meta: [
        { name: 'description', content: 'Atelier Norte designs quiet homes, calm interiors and places to slow down. Architecture and interior studio in Porto, Portugal.' },
        { name: 'theme-color', content: '#22262b' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Manrope:wght@400;500;600&display=swap' },
      ],
      script: [
        { innerHTML: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')" },
      ],
    },
  },
  // Static output: every project page is pre-rendered, so it can be hosted free on Cloudflare Pages / Netlify.
  nitro: { prerender: { crawlLinks: true, routes: ['/'] } },
})
