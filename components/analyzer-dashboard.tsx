"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { SearchHeader } from "@/components/search-header"
import { ProfileHero } from "@/components/profile-hero"
import { MetricsGrid } from "@/components/metrics-grid"
import { InsightsSection } from "@/components/insights-section"
import { HistoryDrawer } from "@/components/history-drawer"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { EmptyState, ErrorState } from "@/components/states"
import type { HistoryEntry, ProfileAnalysis } from "@/lib/types"
import { getHistory, saveToHistory, clearHistory } from "@/lib/history"

type Status = "idle" | "loading" | "success" | "error"

export function AnalyzerDashboard() {
  const [status, setStatus] = useState<Status>("idle")
  const [profile, setProfile] = useState<ProfileAnalysis | null>(null)
  const [error, setError] = useState("")
  const [lastQuery, setLastQuery] = useState("")
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const analyze = useCallback(async (username: string) => {
    const clean = username.trim().replace(/^@/, "")
    if (!clean) return
    setLastQuery(clean)
    setStatus("loading")
    setError("")
    setDrawerOpen(false)

    try {
      const res = await fetch(`/api/analyze/${encodeURIComponent(clean)}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Failed to analyze this profile.")
        setStatus("error")
        return
      }

      const result = data as ProfileAnalysis
      setProfile(result)
      setStatus("success")
      setHistory(saveToHistory(result))
      toast.success(`Analyzed @${result.username}`, {
        description: `Engagement score: ${result.engagementScore}/100`,
      })
    } catch {
      setError("A network error occurred. Please check your connection and try again.")
      setStatus("error")
    }
  }, [])

  const handleClear = useCallback(() => {
    setHistory(clearHistory())
    toast.success("History cleared")
  }, [])

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,var(--primary)_0%,transparent_70%)] opacity-[0.07]"
      />

      <SearchHeader onAnalyze={analyze} onOpenHistory={() => setDrawerOpen(true)} loading={status === "loading"} />

      <section className="mt-10" aria-live="polite">
        {status === "idle" && <EmptyState onPick={analyze} />}
        {status === "loading" && <DashboardSkeleton />}
        {status === "error" && <ErrorState message={error} onRetry={() => analyze(lastQuery)} />}
        {status === "success" && profile && (
          <div className="space-y-6">
            <ProfileHero profile={profile} />
            <MetricsGrid profile={profile} />
            <InsightsSection profile={profile} />
          </div>
        )}
      </section>

      <HistoryDrawer
        open={drawerOpen}
        entries={history}
        onClose={() => setDrawerOpen(false)}
        onSelect={analyze}
        onClear={handleClear}
      />
    </main>
  )
}
