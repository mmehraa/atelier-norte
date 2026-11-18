import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Which effect the next route change should use: a curtain wipe, or an image that expands to fill the screen. */
export const useRouteFx = () => useState<'curtain' | 'expand'>('route-fx', () => 'curtain');

/** Returns a function that grows an image to full screen, then navigates. The next page fades the clone away. */
export function useExpandTo() {
  const fx = useRouteFx();
  const { $lenis, $reduce } = useNuxtApp();
  return (imgEl: HTMLImageElement | null | undefined, to: string) => {
    if (!imgEl || $reduce) return navigateTo(to);
    const r = imgEl.getBoundingClientRect();
    const clone = document.createElement('img');
    clone.src = imgEl.currentSrc || imgEl.src;
    clone.id = 'fx-clone';
    clone.alt = '';
    Object.assign(clone.style, {
      position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`,
      objectFit: 'cover', zIndex: '95', margin: '0', borderRadius: getComputedStyle(imgEl).borderRadius, pointerEvents: 'none',
    });
    document.body.appendChild(clone);
    fx.value = 'expand';
    $lenis?.stop();
    gsap.to(clone, {
      left: 0, top: 0, width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
      duration: 1.1, ease: 'expo.inOut', onComplete: () => { navigateTo(to); },
    });
  };
}

/**
 * Shared scroll animations for a page: [data-split] headings, [data-fade] blocks, [data-parallax] images.
 * Everything is created inside a gsap.context and reverted when the component unmounts.
 */
export function useRevealAnimations(root: Ref<HTMLElement | undefined>) {
  let ctx: gsap.Context | undefined;
  onMounted(() => {
    const { $reduce } = useNuxtApp();
    if ($reduce || !root.value) return;
    document.fonts.ready.then(() => {
      if (!root.value) return;
      ctx = gsap.context(() => {
        root.value!.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          // autoSplit re-measures lines if the width changes (scrollbar, resize, late layout).
          SplitText.create(el, {
            type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
            onSplit: (s) => {
              gsap.set(el, { visibility: 'visible' });
              return gsap.from(s.lines, { yPercent: 105, duration: 1.3, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
            },
          });
        });
        const fades = root.value!.querySelectorAll('[data-fade]');
        if (fades.length) {
          gsap.set(fades, { y: 40, opacity: 0 });
          ScrollTrigger.batch(fades, { start: 'top 92%', once: true, onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.1 }) });
        }
        root.value!.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }, root.value);
      ScrollTrigger.refresh();
    });
  });
  onBeforeUnmount(() => ctx?.revert());
}
