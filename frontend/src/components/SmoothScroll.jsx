"use client";

import React, { useEffect, createContext, useContext, useRef } from 'react';
import Lenis from 'lenis';


const SmoothScrollContext = createContext({
  lenis: null,
  scrollTo: () => { },
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: true,
      smoothTouch: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 2.0,
      touchInertiaMultiplier: 35,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Global event listener for smooth scrolling on all anchor links with `#id`
    const handleAnchorClick = (e) => {
      const target = e.target;
      const anchor = target?.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          const element = document.querySelector(href);
          if (element) {
            e.preventDefault();
            lenis.scrollTo(element, { duration: 1.2, offset: -70 });
            window.history.pushState(null, '', href);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    document.addEventListener('touchend', handleAnchorClick, { passive: true });

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('touchend', handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target, options) => {
    if (lenisRef.current) {
      let targetEl = target;
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) targetEl = el;
      }
      lenisRef.current.scrollTo(targetEl, { duration: 1.2, offset: -80, ...options });
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
