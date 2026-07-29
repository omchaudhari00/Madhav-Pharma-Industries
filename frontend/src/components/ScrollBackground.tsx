"use client";

import React, { useEffect, useRef } from 'react';

export default function ScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameCount = 300;
    const images: HTMLImageElement[] = [];
    let lastDrawnFrame = -1;
    let targetFrameIndex = 0;
    let currentFrameIndex = 0;
    let animationFrameId: number;

    function isPhoneOrPortrait(): boolean {
      if (typeof window === 'undefined') return false;
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Phone screens (<= 768px width) OR portrait/16:9 phone aspect ratio (height >= width)
      return width <= 768 || height >= width;
    }

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(Math.round(currentFrameIndex), true);
    }

    function drawFrame(index: number, force = false) {
      if (!ctx) return;
      const isPhone = isPhoneOrPortrait();
      const actualIndex = isPhone ? frameCount - 1 : index;

      if (actualIndex < 0 || actualIndex >= frameCount) return;
      if (!force && actualIndex === lastDrawnFrame) return;

      let img = images[actualIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        // Fallback: use closest loaded frame to ensure smooth rendering without blank canvas
        let closestImg: HTMLImageElement | null = null;
        let minDiff = Infinity;
        for (let i = 0; i < frameCount; i++) {
          const candidate = images[i];
          if (candidate && candidate.complete && candidate.naturalWidth > 0) {
            const diff = Math.abs(i - actualIndex);
            if (diff < minDiff) {
              minDiff = diff;
              closestImg = candidate;
            }
          }
        }
        if (!closestImg) return;
        img = closestImg;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // Preserve aspect ratio while covering the entire background (object-fit: cover)
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const drawWidth = img.naturalWidth * scale;
      const drawHeight = img.naturalHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      lastDrawnFrame = actualIndex;
    }

    // Preload helper function
    function loadFrame(i: number) {
      if (i < 1 || i > frameCount) return;
      const idx = i - 1;
      if (images[idx]) return;

      const img = new Image();
      img.decoding = 'async';
      const frameNumber = String(i).padStart(3, '0');
      img.src = `/scroll-frames/ezgif-frame-${frameNumber}.jpg`;
      images[idx] = img;

      img.onload = () => {
        const isPhone = isPhoneOrPortrait();
        const targetDrawIndex = isPhone ? frameCount - 1 : Math.round(currentFrameIndex);
        if (idx === targetDrawIndex || (isPhone && idx === frameCount - 1)) {
          drawFrame(targetDrawIndex, true);
        }
      };
    }

    // Immediately load last frame first for phone permanent background, then first frame for desktop
    loadFrame(frameCount);
    loadFrame(1);

    // Preload remaining frames
    for (let i = 1; i <= frameCount; i++) {
      loadFrame(i);
    }

    function updateTargetFrame() {
      if (isPhoneOrPortrait()) {
        targetFrameIndex = frameCount - 1;
        currentFrameIndex = frameCount - 1;
        drawFrame(frameCount - 1);
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) {
        targetFrameIndex = 0;
      } else {
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
        targetFrameIndex = scrollFraction * (frameCount - 1);
      }
    }

    function animate() {
      if (isPhoneOrPortrait()) {
        if (lastDrawnFrame !== frameCount - 1) {
          currentFrameIndex = frameCount - 1;
          targetFrameIndex = frameCount - 1;
          drawFrame(frameCount - 1);
        }
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const diff = targetFrameIndex - currentFrameIndex;
      if (Math.abs(diff) > 0.001) {
        currentFrameIndex += diff * 0.15;
        drawFrame(Math.round(currentFrameIndex));
      } else if (currentFrameIndex !== targetFrameIndex) {
        currentFrameIndex = targetFrameIndex;
        drawFrame(Math.round(currentFrameIndex));
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', updateTargetFrame, { passive: true });

    resizeCanvas();
    updateTargetFrame();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateTargetFrame);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.5,
      }}
    />
  );
}
