/**
 * Optional manual Web Analytics beacon.
 *
 * You usually do NOT need this env var:
 * - Cloudflare Pages: enable Web Analytics under project → Metrics (auto-injected on deploy).
 * - Proxied custom domain (orange cloud): enable automatic setup in Web Analytics dashboard.
 *
 * Only set NEXT_PUBLIC_CF_BEACON_TOKEN for manual snippet installation
 * (e.g. DNS-only domains or sites not proxied through Cloudflare).
 */
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) return null;

  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${token}"}`}
    />
  );
}
