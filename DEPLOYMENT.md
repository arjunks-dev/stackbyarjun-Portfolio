# Deployment Guide

This portfolio supports deployment to **Cloudflare Pages**, **Vercel**, **Netlify**, and **GitHub Actions**.

---

## Cloudflare Pages (Recommended)

### Prerequisites

- Cloudflare account
- GitHub repository connected to Cloudflare Pages
- Node.js 20+

### Dashboard Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Select your repository: `arjunks-dev/stackbyarjun-Portfolio`
3. Configure build settings:

| Setting | Value |
|---------|-------|
| **Framework preset** | Next.js |
| **Build command** | `npm run build` |
| **Build output directory** | *(leave default / auto)* |
| **Deploy command** | *(leave empty — do not use `wrangler deploy`)* |
| **Root directory** | `/` |
| **Node.js version** | `20` |

> **Important:** Cloudflare Pages deploys automatically after the build. Never set the deploy command to `npx wrangler deploy` — that is for Workers, not Pages, and will fail with: *"It looks like you've run a Workers-specific command in a Pages project."*

### Alternative build (edge API routes via next-on-pages)

| Setting | Value |
|---------|-------|
| **Build command** | `npm run pages:build` |
| **Build output directory** | `.vercel/output/static` |
| **Deploy command** | *(leave empty)* |

4. Add environment variables (required):

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
NEXT_PUBLIC_GITHUB_USERNAME=arjunks94
CONTACT_FORM_WEBHOOK_URL=https://your-webhook-url
```

> **Do not set `NEXT_PUBLIC_CF_BEACON_TOKEN`** unless you use manual analytics setup (see below).

5. Click **Save and Deploy**

### Troubleshooting: `wrangler deploy` error on Pages

If your build log shows:

```
Executing user deploy command: npx wrangler deploy
✘ [ERROR] It looks like you've run a Workers-specific command in a Pages project.
```

**Fix in Cloudflare Dashboard:**

1. Open your Pages project → **Settings** → **Build**
2. Clear the **Deploy command** field completely (leave it blank)
3. Set **Build command** to `npm run build`
4. Clear or reset **Build output directory** to the Next.js default
5. Set **Node.js version** to `20`
6. **Retry deployment**

Your build already succeeded — only the deploy step was misconfigured.


### Advanced: Full Next.js on Cloudflare (Edge)

For SSR and API routes on Cloudflare Workers edge:

```bash
npm run pages:build
npm run pages:deploy
```

This uses `@cloudflare/next-on-pages` to compile Next.js for Cloudflare's edge runtime.

### Cloudflare Web Analytics (no token needed for most setups)

Cloudflare offers **three** analytics paths. You only need **one**.

| Setup | Token needed? | How to enable |
|-------|---------------|---------------|
| **Cloudflare Pages** (`.pages.dev` or custom domain on Pages) | **No** | Pages project → **Metrics** → **Enable** Web Analytics. CF injects the beacon automatically on the next deploy. |
| **Proxied custom domain** (orange-cloud DNS on your zone) | **No** | **Analytics & Logs** → **Web Analytics** → **Add a site** → select hostname → automatic injection is on by default. |
| **Manual snippet** (DNS-only / not proxied through CF) | **Yes** | Web Analytics → **Enable with JS Snippet installation** → copy token → set `NEXT_PUBLIC_CF_BEACON_TOKEN`. |

**If your domain is proxied through Cloudflare (orange cloud), you do not need `NEXT_PUBLIC_CF_BEACON_TOKEN`.** Cloudflare injects analytics at the edge — data goes to `https://yourdomain.com/cdn-cgi/rum`, not via a manual env token.

The `CloudflareAnalytics` component in this project is a **fallback** for manual setup only. If the env var is unset, it renders nothing and Cloudflare handles analytics automatically when enabled in the dashboard.

**Pages one-click:** Workers & Pages → your project → **Metrics** → **Enable** under Web Analytics.

**Verify it's working:** After deploy, open your site → View Page Source → search for `beacon.min.js` or `cdn-cgi/rum`. Or check **Web Analytics** dashboard for page views within ~30 minutes.

### Cloudflare Turnstile

1. Go to **Turnstile** in Cloudflare Dashboard
2. Create a widget for your domain
3. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`

### Custom Domain

1. In your Pages project → **Custom domains**
2. Add your domain (e.g., `stackbyarjun.com`)
3. Update DNS records as instructed
4. SSL is provisioned automatically

---

## Reconnect Cloudflare Pages to org repo

If you previously connected `arjunks94/stackbyarjun-Portfolio`, switch to the org repo:

1. **Org repo:** `https://github.com/arjunks-dev/stackbyarjun-Portfolio`

2. **Option A — Change Git source (preferred)**
   - Cloudflare Dashboard → **Workers & Pages** → your project
   - **Settings** → **Build** → manage Git integration
   - Disconnect old repo → Connect `arjunks-dev/stackbyarjun-Portfolio`
   - Grant Cloudflare access to the **arjunks-dev** org when GitHub prompts you
   - Branch: `main`

3. **Option B — Create fresh Pages project**
   - **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
   - Select `arjunks-dev/stackbyarjun-Portfolio`
   - Use build settings from the table above
   - Re-add environment variables and custom domain
   - Delete the old Pages project when the new one works

4. **Org secrets for GitHub Actions** (if using CI deploy)
   - GitHub → **arjunks-dev** org → **Settings** → **Secrets and variables** → **Actions**
   - Add org-level secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, etc.
   - Org variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GITHUB_USERNAME`

---

## GitHub Actions (CI/CD)

The repository includes automated deployment workflows:

- **`.github/workflows/ci.yml`** — Lint and build on every push/PR
- **`.github/workflows/deploy.yml`** — Deploy to Cloudflare Pages on push to `main`

### Required GitHub Secrets (store in `arjunks-dev` org)

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | API token with Pages edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key |

> `NEXT_PUBLIC_CF_BEACON_TOKEN` is **not required** when using Pages or proxied-domain automatic analytics.

### Required GitHub Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production URL |
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub username |

---

## Vercel

1. Import repository at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Next.js** (auto-detected)
3. Add environment variables from `.env.example`
4. Deploy

Vercel provides native Next.js support with zero configuration.

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

---

## Netlify

1. Import repository at [app.netlify.com](https://app.netlify.com)
2. Build settings:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `.next` |
| Node version | `20` |

3. Install the Next.js Netlify plugin or use static export
4. Add environment variables
5. Deploy

For full Next.js support, add `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## Decap CMS Authentication

Decap CMS requires GitHub OAuth for production editing.

### Option 1: Cloudflare Worker OAuth Proxy

Deploy an OAuth proxy worker and update `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: your-username/your-repo
  branch: main
  base_url: https://your-oauth-proxy.workers.dev
  auth_endpoint: auth
```

### Option 2: Netlify Identity (if using Netlify)

Enable Netlify Identity and Git Gateway for authentication.

### Local Development

```bash
npx decap-server
```

Set `local_backend: true` in `config.yml` (already configured).

---

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test CMS admin at `/admin`
- [ ] Confirm contact form with Turnstile
- [ ] Check sitemap at `/sitemap.xml`
- [ ] Validate robots.txt at `/robots.txt`
- [ ] Run Lighthouse audit (target: 95+)
- [ ] Verify OpenGraph previews
- [ ] Test mobile responsiveness
- [ ] Confirm Cloudflare Analytics tracking

---

## Performance Tips

- Replace placeholder images in `/public/images/` with optimized WebP/AVIF
- Replace `/public/resume.pdf` with your actual resume
- Update `content/personal/info.json` with your details
- Configure CDN caching headers in Cloudflare
- Enable Cloudflare Auto Minify and Brotli compression
