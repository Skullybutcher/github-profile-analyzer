"use client"

import { Compass, AlertTriangle, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const SUGGESTIONS = ["torvalds", "gaearon", "sindresorhus", "tj", "yyx990803"]

export function EmptyState({ onPick }: { onPick: (username: string) => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center animate-fade-in-up">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-7" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold">No profile analyzed yet</h2>
      <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
        Search for a GitHub username above to generate a full developer breakdown, or try one of these:
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onPick(name)}
            className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-all hover:border-primary/50 hover:text-primary"
          >
            @{name}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center animate-fade-in-up">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
        <AlertTriangle className="size-7" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">{message}</p>
      <Button variant="secondary" className="mt-5" onClick={onRetry}>
        <RotateCw className="size-4" aria-hidden="true" />
        Try again
      </Button>
    </div>
  )
}
