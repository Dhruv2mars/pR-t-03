# Deployment Guide

## Vercel Deployment (Web App)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- RapidAPI key for Judge0 (optional)

### Environment Variables
Set these in your Vercel dashboard:

```
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

### Deployment Steps

1. **Connect Repository**:
   - Go to Vercel dashboard
   - Import your GitHub repository
   - Select the root directory

2. **Configure Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `bun install && bun run build --filter=web`
   - Output Directory: `apps/web/dist`
   - Install Command: `bun install`

3. **Environment Variables**:
   - Add `VITE_RAPIDAPI_KEY` in Vercel dashboard
   - Or leave empty to use fallback executor

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Troubleshooting

#### Build Errors
- Ensure all dependencies are in package.json
- Check that monorepo structure is properly configured
- Verify TypeScript compilation passes

#### Runtime Errors
- Check browser console for errors
- Verify environment variables are set
- Test sql.js initialization

## macOS App Distribution

### GitHub Releases
1. Build the app: `cd apps/macos && bun tauri build`
2. Upload DMG file to GitHub releases
3. Users download and install manually

### App Store (Future)
- Requires Apple Developer account
- Code signing and notarization needed
- Follow Apple's submission guidelines

## Development

### Local Development
```bash
# Install dependencies
bun install

# Start web app
bun dev --filter=web

# Start macOS app
bun dev --filter=macos

# Build all
bun build
```

### Testing
```bash
# Type check
bun run type-check

# Build test
bun run build --filter=web
```