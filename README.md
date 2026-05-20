# Binice — landningssida

React + Vite + Tailwind. Implementerar startsidan från Figma-filen
`Designprojekt → Demo` (node `903:98`).

## Komma igång

```bash
cd binice-website
npm install
npm run dev
```

Öppna `http://localhost:5173`.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** med Binice-paletten i `tailwind.config.js`
- Google Fonts: **Poetsen One** (rubriker), **Chewy** (logotyp), **Inter** (brödtext)

## Struktur

```
src/
  components/
    StartPage.tsx     ← startsidan
  assets/             ← bilder hämtade från Figma
  App.tsx
  main.tsx
  index.css
```

## Färger (matchar Figma)

| Token       | Hex       | Används till                 |
| ----------- | --------- | ---------------------------- |
| `ink`       | `#395970` | Primär text, footer          |
| `ink-soft`  | `#7d94a4` | Accent i rubrik              |
| `sage`      | `#d5e3d6` | Hero-bakgrund                |
| `clay`      | `#e18d56` | CTA-knapp, aktiv nav         |
| `slate`     | `#8299a7` | "Browser bar" på demobilden  |
| `muted`     | `#454545` | Sekundär nav-text            |
