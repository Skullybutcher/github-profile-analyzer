"use client"

import { FolderGit2, Users, UserPlus, Gauge, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { ProfileAnalysis } from "@/lib/types"
import { formatCompact } from "@/lib/format"

interface Metric {
  label: string
  value: string
  hint: string
  icon: LucideIcon
}

export function MetricsGrid({ profile }: { profile: ProfileAnalysis }) {
  const metrics: Metric[] = [
    {
      label: "Public Repositories",
      value: formatCompact(profile.publicRepos),
      hint: `${profile.reposPerYear}/yr velocity`,
      icon: FolderGit2,
    },
    {
      label: "Followers",
      value: formatCompact(profile.followers),
      hint: "Audience reach",
      icon: Users,
    },
    {
      label: "Following",
      value: formatCompact(profile.following),
      hint: "Network size",
      icon: UserPlus,
    },
    {
      label: "Engagement Score",
      value: `${profile.engagementScore}`,
      hint: "Computed 0–100",
      icon: Gauge,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <Card
          key={m.label}
          className="group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <m.icon className="size-5" aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight">{m.value}</div>
          <div className="mt-1 text-sm font-medium text-foreground">{m.label}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{m.hint}</div>
        </Card>
      ))}
    </div>
  )
}
