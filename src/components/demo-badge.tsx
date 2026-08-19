/** Deja claro que esto es una réplica no oficial con fines de demostración. */
export function DemoBadge() {
  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-50">
      <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 shadow-lg">
        <span className="inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
        DEMO — réplica no oficial de bolsamercantil.com.co
      </span>
    </div>
  )
}
