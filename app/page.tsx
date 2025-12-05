export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">Bienvenue sur le site</h1>
        <p className="max-w-md text-lg text-muted-foreground">Ce site cache un secret... Saurez-vous le découvrir ?</p>
      </div>

      <div className="grid gap-4 text-center">
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-semibold text-card-foreground">Un indice...</h2>
          <p className="text-sm text-muted-foreground">
            Pensez à une direction : haut, haut, puis changez de cap vers le bas...
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground/60">
        Tapez la bonne séquence de touches pour révéler le jeu caché 🎮
      </p>
    </main>
  )
}
