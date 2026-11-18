<script setup lang="ts">
const time = ref('');
const sent = ref('');
let t: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tick = () => { time.value = fmt.format(new Date()); };
  tick();
  t = setInterval(tick, 1000);
});
onBeforeUnmount(() => clearInterval(t));

// Demo only: for a real studio, POST this to Formspree / Netlify Forms / a CRM.
function submit(e: Event) {
  const f = new FormData(e.target as HTMLFormElement);
  sent.value = `Thank you, ${f.get('name')}. We'll reply within two working days.`;
  (e.target as HTMLFormElement).reset();
}
const field = 'w-full border-0 border-b border-paper/25 bg-transparent px-0 py-3 text-lg text-paper outline-none transition-colors placeholder:text-paper/30 focus:border-bronze';
</script>

<template>
  <section id="contact" class="bg-ink text-paper">
    <div class="mx-auto grid max-w-[1600px] gap-16 px-5 py-28 sm:px-10 md:grid-cols-2 md:py-44">
      <div>
        <p class="label text-bronze">(05) Start a project</p>
        <h2 data-split class="mt-6 font-display text-6xl leading-[0.9] font-light sm:text-8xl">Let's build something <em>quiet.</em></h2>
        <a href="mailto:hello@ateliernorte.example" class="link-line mt-12 inline-block font-display text-3xl font-light italic sm:text-4xl">hello@ateliernorte.example</a>
        <dl class="mt-14 grid grid-cols-2 gap-8 text-sm">
          <div><dt class="label text-paper/50">Studio</dt><dd class="mt-2 text-paper/80">Rua das Flores 112<br />4050-265 Porto</dd></div>
          <div><dt class="label text-paper/50">Porto time</dt><dd class="mt-2 font-display text-3xl tabular-nums">{{ time || '--:--:--' }}</dd></div>
        </dl>
      </div>
      <form class="grid content-start gap-8 sm:grid-cols-2" data-fade @submit.prevent="submit">
        <label class="label text-paper/50">Name<input name="name" required autocomplete="name" :class="field" /></label>
        <label class="label text-paper/50">Email<input name="email" type="email" required autocomplete="email" :class="field" /></label>
        <label class="label text-paper/50">Project type
          <select name="type" :class="field"><option class="bg-ink">New home</option><option class="bg-ink">Renovation</option><option class="bg-ink">Interior</option><option class="bg-ink">Hospitality</option></select>
        </label>
        <label class="label text-paper/50">Budget
          <select name="budget" :class="field"><option class="bg-ink">Under €250k</option><option class="bg-ink">€250k – €750k</option><option class="bg-ink">€750k – €2m</option><option class="bg-ink">€2m+</option></select>
        </label>
        <label class="label text-paper/50 sm:col-span-2">Tell us about it<textarea name="message" rows="3" :class="field" placeholder="Site, timeline, what matters to you…" /></label>
        <div class="sm:col-span-2">
          <button class="group inline-flex items-center gap-4 rounded-full border border-paper/30 px-8 py-4 label transition-colors hover:bg-paper hover:text-ink">
            Send enquiry <span class="transition-transform duration-500 group-hover:translate-x-2">→</span>
          </button>
        </div>
        <p v-if="sent" role="status" class="text-bronze sm:col-span-2">{{ sent }}</p>
      </form>
    </div>
  </section>
</template>
