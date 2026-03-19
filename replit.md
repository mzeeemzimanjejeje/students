# TRUTH MD Site

A React + Vite landing page for the TRUTH MD WhatsApp bot project.

## Tech Stack

- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Routing**: Wouter
- **State**: TanStack Query
- **Language**: TypeScript

## Project Structure

```
src/
  App.tsx          # Main app with all page sections (Hero, Hub, Deploy, Install, FAQ)
  main.tsx         # React entry point
  index.css        # Global styles
  components/ui/   # shadcn/ui components
  hooks/           # Custom React hooks
  lib/utils.ts     # Utility functions
  pages/           # Additional pages (not-found)
public/            # Static assets (favicon, logos)
```

## Running the App

```bash
npm install --include=dev
npm run dev
```

The dev server runs on port 5000 at `0.0.0.0` for Replit compatibility.

## Features

- Hero section with quick deploy & install buttons
- Quick Access Hub (Pair Code Servers, QR Code Generator)
- GitHub stats integration (stars/forks via GitHub API)
- Site analytics section (requires `/api/stats` backend — shows "—" without it)
- Deploy section with platform cards (Heroku, Replit, Render, Railway)
- Installation guide with tabs (Windows, VPS, Termux, PM2)
- FAQ section
- Floating bottom navigation

## Notes

- The `/api/stats` endpoints (page views, pair clicks) require a separate backend on port 8080. Without it, the analytics cards show "—" — this is handled gracefully.
- Migrated from Vercel to Replit: removed `/students/` base path, set port to 5000, removed API proxy config.
