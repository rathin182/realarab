'use client';

import React, { useEffect } from 'react';

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    let lenisInstance: any = null;
    let animationFrameId: number;

    import('lenis').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.2,
      });

      function raf(time: number) {
        lenisInstance?.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      }
      animationFrameId = requestAnimationFrame(raf);
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  return <>{children}</>;
};
