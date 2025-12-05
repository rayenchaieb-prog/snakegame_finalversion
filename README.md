# NIRD Snake - Hidden Snake Game Web

A modern web application featuring a hidden snake game that can be unlocked using a secret keyboard code. Built with Next.js 16, React 19, Tailwind CSS, and shadcn/ui components.

## Overview

This project is a creative, interactive website that hides a retro snake game behind a secret code activation system. Visitors are challenged to discover the hidden sequence of keyboard inputs to unlock the classic game experience.

## Features

- **Secret Code Activation**: Discover the hidden keyboard sequence to unlock the game
- **Classic Snake Game**: Pixel-perfect retro snake gameplay with modern styling
- **Penguin Renderer**: Unique penguin-themed visual elements
- **Particle Effects**: Smooth animations and visual feedback
- **Dark Mode Support**: Fully themed dark mode with neon color accents
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Analytics Integration**: Vercel Analytics built-in for usage tracking

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) - React framework with App Router
- **React**: 19.2.0 with concurrent features
- **Styling**: 
  - [Tailwind CSS 4.1](https://tailwindcss.com) with v4 configuration
  - Custom theme with neon colors and oklch color system
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) - Radix UI + Tailwind CSS components
- **Forms**: React Hook Form + Zod for validation
- **Animations**: tailwindcss-animate with custom tw-animate-css
- **Analytics**: Vercel Analytics
- **Type Safety**: TypeScript 5

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx           # Root layout with SecretCodeProvider
│   ├── page.tsx             # Homepage with hidden hints
│   └── globals.css          # Global styles and theme configuration
├── components/
│   ├── snake-game/          # Game-specific components
│   │   ├── snake-game.tsx   # Main game logic and rendering
│   │   ├── secret-code-provider.tsx  # Code activation wrapper
│   │   ├── game-ui.tsx      # Game UI overlay
│   │   ├── penguin-renderer.tsx # Penguin visual element
│   │   ├── particles.tsx    # Particle effects
│   │   ├── activation-hint.tsx # Hint display
│   │   └── constants.ts     # Game constants
│   ├── theme-provider.tsx   # Theme management
│   └── ui/                  # shadcn/ui components
├── hooks/
│   ├── use-secret-code.ts   # Secret code detection hook
│   ├── use-mobile.tsx       # Mobile detection hook
│   └── use-toast.ts         # Toast notifications hook
├── lib/
│   └── utils.ts             # Utility functions (cn helper)
└── public/
    ├── icon.svg             # Main icon
    ├── icon-light-32x32.png # Light theme icon
    └── icon-dark-32x32.png  # Dark theme icon
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ (v22 recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/nird-snake-game.git
cd nird-snake-game
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Play

1. Visit the website and read the hint on the homepage
2. Discover the secret keyboard code sequence
3. Enter the code to unlock the hidden snake game the code is "upupdown"
4. Use arrow keys or WASD to control the snake
5. Eat the food (indicated by a different color) to grow longer
6. Avoid hitting the walls or yourself
7. Try to beat your high score!

### Secret Code Hint

The homepage contains a cryptic hint about the code sequence. Look for clues about directions!

## Available Scripts

\`\`\`bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
\`\`\`

## Customization

### Changing the Secret Code

Edit `components/snake-game/constants.ts` to modify the secret code sequence.

### Theming

The project uses a sophisticated theming system with CSS variables defined in `app/globals.css`:

- **Primary Color**: Neon cyan (`--primary: oklch(0.75 0.25 180)`)
- **Accent Colors**: Pink, green, orange neon variants
- **Background**: Deep purple/dark theme optimized for gaming
- **Theme Variables**: Customizable through CSS custom properties

To modify colors, edit the CSS variables in `app/globals.css`.

### Game Configuration

Adjust game settings in `components/snake-game/constants.ts`:
- Grid size
- Initial snake length
- Speed multiplier
- Colors and styling

## Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment with built-in analytics:

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Or connect your GitHub repository to Vercel for automatic deployments.

### Deploy to Other Platforms

Since this is a standard Next.js application, you can deploy to any platform that supports Node.js:

\`\`\`bash
npm run build
npm start
\`\`\`

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized for Core Web Vitals
- Turbopack bundler (default in Next.js 16)
- React Compiler support (stable)
- Zero external API dependencies
- Static generation where possible

## License

This project is open source and available under the MIT License. See the LICENSE file for details.

## Inspiration

"NIRD Snake - Libère les PC" celebrates open source software and brings a nostalgic gaming experience to the modern web. The hidden game mechanic adds an element of discovery and delight for users.

## Contributing

Contributions are welcome! Whether it's bug fixes, feature additions, or improvements to the game mechanics, feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Made with 💜 using Next.js and React**
