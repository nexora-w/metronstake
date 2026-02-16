export function KickEmbed() {
  return (
    <section className="border-t border-border bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-6">
          Live on Kick
        </h2>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-border bg-black">
          <iframe
            src="https://kick-player-public.pages.dev/metron"
            title="Metron on Kick"
            className="aspect-video w-full"
            allowFullScreen
          />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <a
            href="https://kick.com/metron"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Watch on Kick.com
          </a>
        </p>
      </div>
    </section>
  )
}
