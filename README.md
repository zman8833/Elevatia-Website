# Elevatia Website

This is the official website for Elevatia - Your AI-Powered Wellness Companion.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is deployed on Vercel. To deploy:

```bash
vercel --prod
```

For force deployment (useful for favicon updates):

```bash
vercel --prod --force
```

## Troubleshooting

### Favicon Not Showing

If the favicon is not displaying properly after deployment:

1. **Browser Cache**: Clear your browser cache or do a hard refresh:
   - Chrome/Firefox: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Safari: `Cmd+Option+R`

2. **Force Deployment**: Use the force flag when deploying:
   ```bash
   vercel --prod --force
   ```

3. **Check Multiple Browsers**: Test in different browsers to confirm it's a caching issue

4. **Incognito/Private Mode**: Test in incognito/private browsing mode

### Responsive Layout Issues

The website is optimized for:
- Mobile: 320px and up
- Tablet: 768px and up  
- Laptop: 1024px and up
- Desktop: 1280px and up

If you notice layout issues on specific screen sizes, check the Tailwind CSS classes in the components.

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Icons**: Custom favicon set (ICO, PNG, Apple Touch Icon)

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   └── [other pages]/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── Logo.tsx
public/
├── favicon.ico             # Main favicon
├── favicon.png             # PNG version for better compatibility
├── apple-icon.png          # Apple touch icon
├── site.webmanifest        # Web app manifest
└── [other assets]/
```

## Contributing

1. Make your changes
2. Test locally with `npm run dev`
3. Build and test with `npm run build`
4. Deploy with `vercel --prod`

## License

All rights reserved - Elevatia, Co.
