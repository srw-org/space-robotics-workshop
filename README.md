# Space Robotics Workshop Website

This repository contains the Space Robotics Workshop website at
[space-robots.org](http://space-robots.org/). It is a Gatsby project with
one page per workshop and a shared template for future events.

## Quick Start

Run the setup script to install everything automatically:

```bash
./setup.sh
```

This installs nvm (if needed), Node 20, yarn, and all dependencies.

## Prerequisites

- Node.js 18-22 (Node 20 LTS recommended; **Node 23+ is not supported**)
- Yarn (classic)
- If you use `nvm`, an `.nvmrc` file is provided — just run `nvm use`

## Manual Install

```bash
cd space-robotics-workshop
nvm use           # or: nvm install 20
yarn install
```

## Develop (local server)

macOS / Linux:
```bash
export NODE_OPTIONS=--max-old-space-size=8192
yarn develop
```

Windows (PowerShell):
```powershell
$env:NODE_OPTIONS="--max-old-space-size=8192"
yarn develop
```

The site runs at `http://localhost:8000/` by default.

## Build + Serve (production preview)

```bash
yarn build
yarn serve
```

## Format

```bash
yarn format
```

## Troubleshooting

- **File watcher limit (Linux):**
  ```bash
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
  ```
- **Clean Gatsby cache:**
  ```bash
  yarn clean
  ```
- **Port already in use:** run `yarn develop -p 8001`

## Add a new workshop page

This site uses a reusable template + data files. To add a new workshop:

1. **Create a data file** in `src/content/workshops/`:
   - Copy `icra2026.ts` or `iros2026.ts` and rename (e.g. `rss2027.ts`).
   - Fill out the `WorkshopData` fields (overview, CFP, speakers, agenda, etc.).
2. **Create a page** in `src/pages/`:
   - Copy `icra2026.tsx` and rename (e.g. `rss2027.tsx`).
   - Import your data file and render `<WorkshopTemplate data={...} />`.
3. **Add it to the hub + header dropdown:**
   - `src/pages/index.tsx` → add a new entry in the `workshops` list.
   - `src/components/page-header.tsx` → add a new link in `OtherYears`.
4. **Add assets (optional):**
   - Place logos/photos under `static/images/...` and reference the path in
     the data file (e.g. `/images/sponsors/my-logo.png`).
5. **Post-workshop sections:**
   - The page template includes commented-out blocks for `Recordings` and
     `Best Paper Awards`. Uncomment when those are ready.

## Deployment

Deployment is handled by GitHub Actions:

- Workflow: `.github/workflows/main.yml`
- Builds and deploys to the `generated-static-pages` branch
- Custom domain: `CNAME` (currently `space-robots.org`)
