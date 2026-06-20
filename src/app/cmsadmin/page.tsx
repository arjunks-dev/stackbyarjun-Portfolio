export default function CmsAdminPage() {
  return (
    <main className="min-h-screen pt-[var(--header-height)]">
      <iframe
        src="/cmsadmin/index.html"
        title="Content Manager"
        className="h-[calc(100vh-var(--header-height))] w-full border-0"
      />
    </main>
  );
}
