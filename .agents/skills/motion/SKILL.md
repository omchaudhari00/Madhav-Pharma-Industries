---
name: motion
description: >-
  Motion animation guidance for React interfaces. Use for gestures, drag and
  drop, scroll-linked effects, layout transitions, SVG animation, spring physics,
  exit transitions, and bundle/performance decisions.
license: MIT
source: https://github.com/secondsky/claude-skills/tree/main/plugins/motion/skills/motion
official_docs: https://motion.dev
---

# Motion Animation Library

Motion is the current package name for the React animation library formerly
known as Framer Motion. Use it when animation is dynamic, interruptible, or
needs gesture, layout, spring, or exit behavior. Prefer CSS for simple,
predetermined transitions.

## Use Motion for

- Drag, pan, hover, tap, focus, and mobile gestures.
- Viewport-triggered reveals, scroll-linked progress, and parallax.
- Shared-element and FLIP layout transitions.
- Expand/collapse, tabs, modals, drawers, toasts, and exit animations.
- SVG path drawing/morphing, spring physics, and staggered sequences.

## Do not use Motion for

- Static content with no state change.
- A simple class or color transition that CSS can handle.
- Heavy 3D scenes, where Three.js or React Three Fiber is more appropriate.
- Large lists without virtualization or a performance plan.

## Installation and imports

```bash
npm install motion
```

```tsx
import { motion, AnimatePresence } from "motion/react"
```

In a Next.js App Router client component, add `"use client"` before importing
Motion. For small bundles, use `LazyMotion` and `m`, or `useAnimate` when a
component does not need the full feature set.

## Core patterns

```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>
```

Use variants for shared states and orchestration:

```tsx
const variants = {
  hidden: { opacity: 0, transform: "translateY(16px)" },
  visible: { opacity: 1, transform: "translateY(0px)" },
}
```

For exit animations, keep `AnimatePresence` mounted and put the conditional
child inside it. Every exiting child needs a stable, unique `key`:

```tsx
<AnimatePresence mode="wait">
  {isOpen && <motion.dialog key="dialog" exit={{ opacity: 0 }} />}
</AnimatePresence>
```

For layout changes, use `layout`, `layoutId`, `LayoutGroup`, `layoutScroll`, or
`layoutRoot` as appropriate. For scroll behavior, use `useInView`, `whileInView`,
`useScroll`, and `useTransform`. For natural gestures, use `drag`, constraints,
and springs so velocity carries through interruptions.

## Motion rules

1. Animate only when it communicates feedback, spatial continuity, state, or
   explanation. If no purpose is clear, make the state change instant.
2. Prefer `transform` and `opacity`; avoid animating layout properties such as
   `width`, `height`, `margin`, `padding`, `top`, and `left` unless there is no
   suitable alternative.
3. Use transitions for rapidly retriggered UI. Use keyframes for a deliberate,
   predetermined sequence. Use springs for gestures and interruptible motion.
4. Keep frequent interactions short and subtle. Do not make a common action wait
   hundreds of milliseconds without a clear reason.
5. Respect `prefers-reduced-motion` and keep keyboard/focus behavior unchanged.
6. Gate hover effects to fine pointers so touch devices do not receive false
   hover states.
7. Do not combine Tailwind `transition-*` classes with Motion on the same
   property; let one system own the transition.
8. Virtualize lists with dozens of animated rows and avoid mounting expensive
   effects off-screen.

## Accessibility

```tsx
import { MotionConfig } from "motion/react"

<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

Reduced motion should remove position changes and preserve a gentle fade or
instant state change. Keep focus visible, preserve DOM order, and never use
animation as the only signal for success, error, or availability.

## Debug checklist

- Does the animation have a user-facing purpose?
- Does it retarget smoothly when interrupted?
- Are the start/end states and keys stable?
- Is the main thread free of avoidable layout/paint work?
- Does it work with keyboard, touch, and reduced motion?
- Is the bundle cost justified by the interaction?

## References

- Official Motion documentation: https://motion.dev
- Official repository: https://github.com/motiondivision/motion
- Agent skill source used for this portable file: https://github.com/secondsky/claude-skills/tree/main/plugins/motion/skills/motion
