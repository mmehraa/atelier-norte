<script setup lang="ts">
import * as THREE from 'three';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { findProject, img } from '~/data/projects';

/*
  Full-screen WebGL slideshow. Each change "melts" one photo into the next:
  a noise field decides which pixels switch first, and both images are pushed
  through the noise while it happens. Photos are cover-fitted in the shader.
*/

const slides = ['lumen-pavilion', 'pinar-house', 'casa-alba', 'villa-mar'].map((s) => findProject(s)!);
const DURATION = 6;

const canvas = ref<HTMLCanvasElement>();
const section = ref<HTMLElement>();
const title = ref<HTMLElement>();
const index = ref(0);
const webgl = ref(true);
const current = computed(() => slides[index.value]!);
const pad = (n: number) => String(n + 1).padStart(2, '0');

const frag = /* glsl */ `
  uniform sampler2D uA; uniform sampler2D uB;
  uniform vec2 uSizeA; uniform vec2 uSizeB; uniform vec2 uRes;
  uniform float uP; uniform float uTime; uniform vec2 uMouse;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a*noise(p); p *= 2.; a *= .5; } return v; }
  vec2 cover(vec2 uv, vec2 size){
    float rs = uRes.x / uRes.y, ri = size.x / size.y;
    vec2 s = rs < ri ? vec2(rs / ri, 1.) : vec2(1., ri / rs);
    return (uv - .5) * s + .5;
  }
  void main(){
    vec2 uv = vUv + (uMouse - .5) * .012;                    // gentle mouse parallax
    float n = fbm(vUv * vec2(3., 2.) + uTime * .03);
    float p = uP;
    float t = smoothstep(n - .15, n + .15, p * 1.3 - .15);   // organic reveal mask
    float push = sin(p * 3.14159) * .18;                     // strongest mid-transition
    vec2 uvA = uv + (n - .5) * push * vec2(1., .4);
    vec2 uvB = (uv - .5) * (1. - .1 * (1. - p)) + .5 - (n - .5) * push * vec2(1., .4);
    vec4 a = texture2D(uA, cover(uvA, uSizeA));
    vec4 b = texture2D(uB, cover(uvB, uSizeB));
    gl_FragColor = mix(a, b, t);
  }
`;

let cleanup = () => {};

onMounted(async () => {
  const { $reduce } = useNuxtApp();
  const ctx = gsap.context(() => {}, section.value);
  let split: SplitText | undefined;

  // Title swap: old characters slide up and out, new ones rise in.
  const animateTitle = (first = false) => {
    if ($reduce || !title.value) return;
    split?.revert();
    split = SplitText.create(title.value, { type: 'chars,lines', mask: 'lines', linesClass: 'split-line' });
    gsap.set(title.value, { visibility: 'visible' });
    gsap.from(split.chars, { yPercent: 110, duration: first ? 1.4 : 1.1, ease: 'expo.out', stagger: 0.03, delay: first ? 0.3 : 0.25 });
  };

  let goTo: (i: number) => void = (i) => { index.value = i; };
  let timer: gsap.core.Tween | undefined;
  const schedule = () => { timer?.kill(); if (!$reduce) timer = gsap.delayedCall(DURATION, () => goTo((index.value + 1) % slides.length)); };

  try {
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const textures = await Promise.all(slides.map((s) => loader.loadAsync(img(s.cover, 2000))));
    textures.forEach((t) => { t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; });
    const size = (t: THREE.Texture) => new THREE.Vector2((t.image as HTMLImageElement).width, (t.image as HTMLImageElement).height);

    const uniforms = {
      uA: { value: textures[0] }, uB: { value: textures[1] },
      uSizeA: { value: size(textures[0]!) }, uSizeB: { value: size(textures[1]!) },
      uRes: { value: new THREE.Vector2(1, 1) }, uP: { value: 0 }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      uniforms, fragmentShader: frag,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
    })));

    const resize = () => {
      const w = canvas.value!.clientWidth, h = canvas.value!.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.value!);

    const mouse = new THREE.Vector2(0.5, 0.5);
    const onMove = (e: PointerEvent) => mouse.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    window.addEventListener('pointermove', onMove, { passive: true });

    const tick = (t: number) => {
      uniforms.uTime.value = t;
      uniforms.uMouse.value.lerp(mouse, 0.05);
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    let busy = false;
    goTo = (i: number) => {
      if (busy || i === index.value) return;
      busy = true;
      uniforms.uB.value = textures[i]!;
      uniforms.uSizeB.value = size(textures[i]!);
      index.value = i;
      nextTick(() => animateTitle());
      schedule();
      gsap.fromTo(uniforms.uP, { value: 0 }, {
        value: 1, duration: $reduce ? 0.01 : 1.8, ease: 'power2.inOut',
        onComplete: () => {
          uniforms.uA.value = textures[i]!;
          uniforms.uSizeA.value = size(textures[i]!);
          uniforms.uP.value = 0;
          busy = false;
        },
      });
    };

    // Intro: the image settles from slightly zoomed in. Scrolling away pushes it back.
    ctx.add(() => {
      if ($reduce) return;
      gsap.fromTo(canvas.value!, { scale: 1.25 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
      gsap.to(canvas.value!, { yPercent: 20, ease: 'none', scrollTrigger: { trigger: section.value, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-ui', { opacity: 0, y: -60, ease: 'none', scrollTrigger: { trigger: section.value, start: 'top top', end: '60% top', scrub: true } });
    });

    cleanup = () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  } catch {
    webgl.value = false; // the <img> fallback below takes over
  }

  exposed.go = (i) => goTo(i);
  await document.fonts.ready;
  animateTitle(true);
  if (!$reduce) gsap.from('.hero-ui-fade', { opacity: 0, y: 20, duration: 1, stagger: 0.08, delay: 0.6, ease: 'power3.out' });
  schedule();
  ScrollTrigger.refresh();

  const prevCleanup = cleanup;
  cleanup = () => { prevCleanup(); timer?.kill(); split?.revert(); ctx.revert(); };
});

const exposed: { go: (i: number) => void } = { go: (i) => { index.value = i; } };
onBeforeUnmount(() => cleanup());
</script>

<template>
  <section ref="section" class="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-paper">
    <h1 class="sr-only">Atelier Norte, architecture and interior studio in Porto</h1>
    <canvas v-show="webgl" ref="canvas" class="absolute inset-0 h-full w-full cursor-pointer" aria-hidden="true"
            @click="exposed.go((index + 1) % slides.length)" />
    <img v-if="!webgl" :src="img(current.cover, 2000)" :alt="current.title" class="absolute inset-0 h-full w-full object-cover" />
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/40" />

    <div class="hero-ui pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-8 sm:px-10 sm:pb-12">
      <p class="hero-ui-fade label text-paper/70">Architecture &amp; interiors · Porto</p>
      <p :key="current.slug" ref="title" data-split class="mt-4 font-display text-[19vw] leading-[0.85] font-light tracking-[-0.03em] sm:text-[11vw]">
        {{ current.title }}
      </p>
      <div class="hero-ui-fade pointer-events-auto mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-paper/25 pt-6">
        <div class="flex items-center gap-6">
          <span class="font-display text-2xl tabular-nums">{{ pad(index) }} <span class="text-paper/50">/ {{ pad(slides.length - 1) }}</span></span>
          <div class="flex gap-2">
            <button v-for="(s, i) in slides" :key="s.slug" class="group relative h-8 w-10 sm:w-16" :aria-label="`Show ${s.title}`" @click="exposed.go(i)">
              <span class="absolute inset-x-0 top-1/2 h-px bg-paper/30" />
              <span class="absolute left-0 top-1/2 h-px origin-left bg-paper" :class="i === index ? 'bar-run' : 'w-0'" :style="i === index ? `--d:${DURATION}s` : ''" />
            </button>
          </div>
        </div>
        <p class="text-sm text-paper/70">{{ current.location }} · {{ current.year }}</p>
        <NuxtLink :to="`/projects/${current.slug}`" class="label link-line pb-1">View project →</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bar-run { width: 100%; animation: run var(--d) linear forwards; }
@keyframes run { from { transform: scaleX(0); } to { transform: scaleX(1); } }
</style>
