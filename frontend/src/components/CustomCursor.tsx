"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState<'default' | 'specimen' | 'link' | 'btn'>('default');
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.specimen-card') as HTMLElement;
      const btn = target.closest('button, .btn-primary, .btn-secondary') as HTMLElement;
      const link = target.closest('a') as HTMLElement;

      if (card) {
        setHoverType('specimen');
        setLabel('INSPECT');
      } else if (btn) {
        setHoverType('btn');
        setLabel('');
      } else if (link) {
        setHoverType('link');
        setLabel('');
      } else {
        setHoverType('default');
        setLabel('');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      width: 14,
      height: 14,
      x: mousePosition.x - 7,
      y: mousePosition.y - 7,
      backgroundColor: 'var(--ink)',
      borderColor: 'transparent',
      opacity: 0.85,
    },
    specimen: {
      width: 72,
      height: 72,
      x: mousePosition.x - 36,
      y: mousePosition.y - 36,
      backgroundColor: 'var(--gold)',
      borderColor: 'var(--ink)',
      opacity: 0.95,
    },
    btn: {
      width: 44,
      height: 44,
      x: mousePosition.x - 22,
      y: mousePosition.y - 22,
      backgroundColor: 'transparent',
      borderColor: 'var(--gold)',
      borderWidth: 2,
      opacity: 1,
    },
    link: {
      width: 28,
      height: 28,
      x: mousePosition.x - 14,
      y: mousePosition.y - 14,
      backgroundColor: 'var(--ink)',
      borderColor: 'transparent',
      opacity: 0.9,
    }
  };

  return (
    <motion.div
      className="custom-cursor hidden md:flex items-center justify-center pointer-events-none fixed top-0 left-0 z-[99999] border transition-colors duration-200"
      animate={variants[hoverType]}
      transition={{
        type: 'spring',
        stiffness: 700,
        damping: 38,
        mass: 0.35,
      }}
      style={{
        borderRadius: hoverType === 'specimen' ? '0px' : '0px', // STRICT 0PX SHAPE LANGUAGE
      }}
    >
      {label && (
        <span className="text-[10px] font-extrabold tracking-widest text-white uppercase select-none">
          {label}
        </span>
      )}
    </motion.div>
  );
}
