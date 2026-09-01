---
name: ui-ux-pro-max
description: >-
  UI/UX design intelligence for web, mobile, and desktop interfaces. Use when
  designing, building, reviewing, or fixing pages, components, design systems,
  accessibility, responsive layouts, typography, color, charts, interaction,
  or stack-specific UI implementation.
license: MIT
source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
---

# UI/UX Pro Max

Use this skill as a design-intelligence layer before writing interface code. It
helps choose a coherent visual direction, apply accessible interaction rules,
and keep implementation decisions consistent with the detected product and
technology stack.

## Activate when

- Creating or redesigning a page, component, or design system.
- Choosing layout, spacing, typography, color, iconography, or visual style.
- Reviewing UI quality, responsive behavior, accessibility, or interaction.
- Adding or tuning interface motion, feedback, responsive behavior, or charts.

Skip it for backend-only work, infrastructure, data modeling, or scripts that
do not change how a user sees or interacts with the product.

## Priority rules

Apply these in order. Higher-priority problems block polish work.

1. Accessibility: target WCAG AA contrast; provide meaningful alt text; preserve
   keyboard navigation, visible focus, semantic landmarks, and accessible names.
2. Touch and interaction: make controls at least 44×44px, space nearby targets,
   provide loading and error feedback, and do not rely on hover alone.
3. Performance: use WebP/AVIF where appropriate, lazy-load below-the-fold media,
   reserve media space to prevent layout shift, and avoid layout thrashing.
4. Style selection: choose a style that fits the product and audience; keep it
   consistent; use SVG/icon components instead of emoji as UI icons.
5. Responsive layout: design mobile-first, use content-driven breakpoints, and
   never introduce horizontal scrolling at common viewport sizes.
6. Typography and color: use a readable base size, about 1.5 line-height for
   body text, semantic color tokens, and sufficient light/dark contrast.
7. Animation: animate with purpose, keep timing context-aware, use transform and
   opacity where possible, and provide a reduced-motion path.
8. Forms and feedback: use visible labels, inline validation, useful helper text,
   clear error recovery, and progressive disclosure.
9. Navigation: keep hierarchy predictable, preserve back behavior and deep links,
   and limit bottom navigation to the most important destinations.
10. Charts: use legends and tooltips, accessible colors, readable labels, and do
    not communicate meaning through color alone.

## Workflow

### 1. Extract requirements

Identify the product type, audience, context of use, brand/style adjectives,
target platform, and implementation stack. Inspect the project before assuming
React, Next.js, Vue, Tailwind, or any other framework.

### 2. Generate a design system for new work

When the work affects a new page or product-wide direction, run the bundled
search tool with a focused 2–5 term query:

```bash
python "<skill-root>/scripts/search.py" "<product> <industry> <style>" --design-system -p "<Project Name>"
```

Optional dials tune the result without changing the query:

```bash
python "<skill-root>/scripts/search.py" "<query>" --design-system \
  --variance 1-10 --motion 1-10 --density 1-10
```

To persist the result for later sessions, explicitly point output at the
project root:

```bash
python "<skill-root>/scripts/search.py" "<query>" --design-system \
  --persist -p "<Project Name>" --output-dir "<project-root>"
```

Read an existing `design-system/<project>/MASTER.md` before regenerating it.
Never overwrite it with `--force` without authorization.

### 3. Search targeted guidance

Use one explicit domain for a focused question:

```bash
python "<skill-root>/scripts/search.py" "keyboard focus modal" --domain ux
python "<skill-root>/scripts/search.py" "dark minimal SaaS" --domain style
python "<skill-root>/scripts/search.py" "modern readable" --domain typography
python "<skill-root>/scripts/search.py" "scroll reveal stagger" --domain gsap
python "<skill-root>/scripts/search.py" "suspense streaming" --stack nextjs
```

Useful domains include `product`, `style`, `color`, `typography`, `ux`,
`landing`, `icons`, `chart`, `gsap`, `react`, and `web`. Use the detected stack
for implementation guidance.

### 4. Handle empty results honestly

Retry once with a narrower query or explicit domain/stack. If it still returns
nothing, say that the recommendation is a general fallback; do not fabricate a
database match or present unverified output as sourced guidance.

### 5. Pre-delivery review

Check real viewport sizes, keyboard use, focus visibility, screen-reader names,
contrast, reduced motion, touch targets, loading/error/empty states, dark mode,
and layout stability. Read the upstream `references/pro-rules.md` and
`references/quick-reference.md` when those files are available.

## Output expectations

Choose one visual direction before composing the page. Explain the key design
decisions briefly, use tokens instead of scattered raw values, and make every
interaction state explicit: default, hover, focus, pressed, disabled, loading,
success, and error where relevant.

## Upstream references

- Repository: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Codex platform metadata: `src/ui-ux-pro-max/templates/platforms/codex.json`
- Official install options: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill#installation
