# CMS publish workflow (save many times, deploy once)

## How it works

| Branch | Purpose |
|--------|---------|
| **`cms`** | Decap CMS saves all edits here |
| **`main`** | Cloudflare Pages builds and deploys from here |

Every CMS **Publish** commits to `cms` only — **no live site deploy**.

When you are ready to go live, merge `cms` → `main` **once** → Cloudflare deploys with all changes together.

---

## Daily editing

1. Open https://stackbyarjun.qzz.io/cmsadmin
2. Edit and click **Publish** as many times as you want
3. Live site stays unchanged until you merge (step below)

---

## Publish to live site (deploy)

### Option A — GitHub website (easiest)

1. Open https://github.com/arjunks-dev/stackbyarjun-Portfolio
2. If you see **“cms had recent pushes”** → **Compare & pull request**
3. Create PR: `cms` → `main`
4. Review changes → **Merge pull request**
5. Cloudflare auto-deploys from `main` (one deployment for all CMS edits)

### Option B — PowerShell

```powershell
Set-Location "E:\Dev\stackbyarjun-Portfolio"
git fetch org
git checkout main
git pull org main
git merge org/cms -m "Publish CMS content to live site"
git push org main
```

---

## Sync local code with GitHub (Windows)

CMS created some files with very long names. Enable long paths once:

```powershell
git config core.longpaths true
git fetch org
git pull org main --rebase
```

If pull still fails, clone to a short path like `E:\p\portfolio` or enable Windows long paths in Group Policy.

---

## Slug rules (fixed in config)

Folder collections now use short filenames:

- Experience: `company-role.md`
- Certifications: `certification-name.md`
- Projects / blog: `title.md`

Do **not** use `slug: "{{slug}}"` — that caused `map-name-...` files with paths too long for Windows.
