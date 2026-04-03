# Ghost Photo Theme

A stunning, dark-first photography portfolio theme for Ghost CMS. Built for photographers, visual artists, and creative studios who want their work to speak for itself.

## Design Philosophy

**Dark-first. Image-forward. No clutter.**

Every design decision prioritizes the photograph. Deep blacks, minimal chrome, oversized editorial typography (Playfair Display), and generous whitespace let images breathe. The UI disappears so the art takes center stage.

## Features

### Gallery Layouts
- **Masonry** (default) -- Pinterest-style columns that adapt to image aspect ratios
- **Grid** -- Uniform 4:3 cards for structured presentation
- **List** -- Alternating split-screen editorial layout with excerpts

### Visual Effects
- **Full-bleed hero** -- Featured post fills the entire viewport with gradient overlay
- **Scroll-reveal animations** -- Elements fade/slide in as you scroll (respects prefers-reduced-motion)
- **Parallax hero** -- Subtle depth effect on hero images
- **Image lightbox** -- Click any image for fullscreen zoom with keyboard navigation (Esc, arrows)
- **Hover overlays** -- Cards reveal title/meta on hover with smooth image scale

### Photography-Specific
- **EXIF metadata display** -- Camera, lens, settings (tag posts with "exif")
- **Full-width image support** -- Wide and full-bleed images via Ghost editor
- **Gallery card styling** -- Native Ghost galleries with lightbox integration
- **Responsive images** -- srcset with 6 sizes (30px to 2000px)

### Core
- **Dark/Light/Auto modes** -- Toggle with persistence, system preference detection
- **Transparent header** -- Floats over hero, solidifies with backdrop blur on scroll
- **Ghost native search** -- Cmd/Ctrl+K keyboard shortcut
- **Native comments** -- Full Ghost comments support
- **Members/subscriptions** -- Sign in, sign up, account pages
- **Accessible** -- Skip link, ARIA landmarks, focus-visible indicators, reduced motion support
- **Custom fonts** -- Supports Ghost Admin custom font settings (--gh-font-body, --gh-font-heading)

### 8 Custom Settings

| Setting | Options | Default |
|---------|---------|---------|
| Color Scheme | Dark, Light, Auto | Dark |
| Grid Style | Masonry, Grid, List | Masonry |
| Accent Color | Any color | Gold (#E8C547) |
| Enable Lightbox | On/Off | On |
| Scroll Animations | On/Off | On |
| Show EXIF Data | On/Off | On |
| Header Style | Minimal, Full, Transparent | Transparent |
| Footer Text | Custom text | -- |

## Installation

1. Download the theme ZIP file
2. Go to Ghost admin -> Settings -> Design -> Change theme
3. Click "Upload theme" and select the ZIP
4. Activate the theme

## Development

```bash
npm install
npm run dev    # Development with live reload
npm run build  # Production build
npm test       # GScan validation
npm run zip    # Create distributable ZIP
```

## Typography

- **Headings**: Playfair Display (serif) -- elegant, editorial
- **Body**: Inter (sans-serif) -- clean, highly readable
- **Code**: JetBrains Mono (monospace)

## Color Palette (Dark Mode)

- Background: `#0a0a0a`
- Cards: `#1a1a1a`
- Borders: `#2a2a2a`
- Text: `#f0f0f0`
- Secondary: `#999`
- Accent: `#E8C547` (warm gold)

## Requirements

- Ghost >= 5.0.0

## License

MIT

## Credits

Built by [Elif Digital](https://github.com/Elifterminal)
