"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function ScrollBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (useFallback) return;

    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let isAborted = false;
    let targetTime = 0;
    let currentTime = 0;

    function isPhoneOrPortrait(): boolean {
      if (typeof window === 'undefined') return false;
      const width = window.innerWidth;
      const height = window.innerHeight;
      return width <= 768 || height >= width;
    }

    if (isPhoneOrPortrait()) {
      setUseFallback(true);
      return;
    }

    const handleLoadedMetadata = () => {
      if (isAborted) return;
      setIsVideoReady(true);
      video.pause();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    function updateTargetTime() {
      if (isAborted || !video.duration) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) {
        targetTime = 0;
      } else {
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
        targetTime = scrollFraction * video.duration;
      }
    }

    function animate() {
      if (isAborted) return;
      
      if (video.duration) {
        const diff = targetTime - currentTime;
        if (Math.abs(diff) > 0.03) { // Small threshold to prevent micro-stutters
          currentTime += diff * 0.15; // Smooth interpolation
          video.currentTime = currentTime;
        } else if (Math.abs(currentTime - targetTime) > 0.001) {
          currentTime = targetTime;
          video.currentTime = currentTime;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', updateTargetTime, { passive: true });
    window.addEventListener('resize', () => {
      if (isPhoneOrPortrait()) {
        setUseFallback(true);
      }
    }, { passive: true });

    updateTargetTime();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isAborted = true;
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('scroll', updateTargetTime);
      cancelAnimationFrame(animationFrameId);
    };
  }, [useFallback]);

  return (
    <>
      {/* Default Fallback Background (Responsive) */}
      <div 
        className="bg-responsive-fallback"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          // Always visible on mobile, fades out on desktop when video is ready
          opacity: useFallback || !isVideoReady ? 0.5 : 0,
          transition: 'opacity 1.5s ease-in-out',
          pointerEvents: 'none'
        }}
      />
      
      {/* Video Animation */}
      {!useFallback && (
        <video
          ref={videoRef}
          src="/video/background-scroll.webm"
          muted
          playsInline
          preload="auto"
          className="video-animation"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            zIndex: 1, // Place video on top of fallback
            opacity: isVideoReady ? 0.5 : 0,
            transition: 'opacity 1.5s ease-in-out',
            transform: 'scaleX(-1)' // Mirror effect to match previous canvas
          }}
        />
      )}
    </>
  );
}
