"use client"

// GitHub Profile Analyzer — search header
import type React from "react"
import { useState } from "react"
import { Search, History, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GithubMark } from "@/components/github-mark"

interface SearchHeaderProps {
  onAnalyze: (username: string) => void
  onOpenHistory: () => void
  loading: boolean
}

export function SearchHeader({ onAnalyze, onOpenHistory, loading }: SearchHeaderProps) {
  const [value, setValue] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onAnalyze(trimmed)
  }

  return (
    <header className="flex flex-col items-center text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        GitHub Profile Analyzer
      </div>

      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        Decode any developer&apos;s <span className="text-primary">GitHub DNA</span>
      </h1>
      <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        Enter a username to surface engagement scores, language diversity, repository traction, and activity velocity.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 w-full max-w-xl">
        <div className="group flex items-center gap-2 rounded-2xl border border-border bg-card p-2 transition-all duration-300 focus-within:border-primary/60 focus-within:shadow-[0_0_0_4px] focus-within:shadow-primary/10">
          <div className="flex flex-1 items-center gap-2 pl-3">
            <GithubMark className="size-5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a GitHub username…"
              aria-label="GitHub username"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" disabled={loading || !value.trim()} className="rounded-xl px-5">
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="size-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Analyze Profile</span>
            <span className="sm:hidden">Analyze</span>
          </Button>
        </div>
      </form>

      <button
        type="button"
        onClick={onOpenHistory}
        className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <History className="size-4" aria-hidden="true" />
        View previously analyzed profiles
      </button>
    </header>
  )
}
