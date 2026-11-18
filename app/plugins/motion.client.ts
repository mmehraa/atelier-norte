import 'lenis/dist/lenis.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

// One place to set up GSAP plugins + Lenis smooth scrolling for the whole app.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = reduce ? null : new Lenis({ lerp: 0.09 });
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  return { provide: { lenis, reduce } };
});
