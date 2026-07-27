---
name: Tailwind v4 dark mode class
description: @apply dark is invalid in Tailwind v4 CSS — must apply class via JavaScript
---

In Tailwind v4, `@apply dark` inside `@layer base` throws "Cannot apply unknown utility class `dark`".

**Why:** Tailwind v4 changed how variants work. `dark` is a variant, not a utility — it cannot be used with `@apply`.

**How to apply:** Add the class programmatically in `main.tsx`:
```typescript
document.documentElement.classList.add('dark');
```

Also: Google Fonts `@import url(...)` must be the FIRST line of `index.css`, before `@import "tailwindcss"`. PostCSS fails silently if it appears after other CSS rules.
