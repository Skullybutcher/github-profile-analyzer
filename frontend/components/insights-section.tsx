"use client"

import { Dna, Star, GitFork, Zap, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreRing } from "@/components/score-ring"
import type { ProfileAnalysis } from "@/lib/types"
import { formatCompact, languageColor } from "@/lib/format"

export function InsightsSection({ profile }: { profile: ProfileAnalysis }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <DeveloperDnaCard profile={profile} />
      <RepositoryTractionCard profile={profile} />
      <ActivityVelocityCard profile={profile} />
    </div>
  )
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Dna; children: React.ReactNode }) {
  return (
    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Icon className="size-4 text-primary" aria-hidden="true" />
      {children}
    </CardTitle>
  )
}

function DeveloperDnaCard({ profile }: { profile: ProfileAnalysis }) {
  const top = profile.languages.slice(0, 8)
  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
      <CardHeader>
        <SectionTitle icon={Dna}>Developer DNA</SectionTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Dominant language</span>
          <div className="mt-2">
            <span
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-lg font-semibold"
              style={{ borderColor: `${languageColor(profile.dominantLanguage)}55` }}
            >
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: languageColor(profile.dominantLanguage) }}
                aria-hidden="true"
              />
              {profile.dominantLanguage}
            </span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Language diversity</span>
            <span className="text-xs text-muted-foreground">{profile.languages.length} languages</span>
          </div>
          {top.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {top.map((lang) => (
                <Badge
                  key={lang.name}
                  variant="secondary"
                  className="gap-1.5 font-normal"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: languageColor(lang.name) }}
                    aria-hidden="true"
                  />
                  {lang.name}
                  <span className="text-muted-foreground">{lang.percentage}%</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No language data available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function RepositoryTractionCard({ profile }: { profile: ProfileAnalysis }) {
  const stats = [
    { icon: Star, label: "Total stars", value: formatCompact(profile.totalStars) },
    { icon: GitFork, label: "Total forks", value: formatCompact(profile.totalForks) },
  ]
  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: "140ms" }}>
      <CardHeader>
        <SectionTitle icon={Star}>Repository Traction</SectionTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-secondary/50 p-4">
              <s.icon className="mb-2 size-4 text-primary" aria-hidden="true" />
              <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Traction rating</div>
            <div className="mt-1 text-base font-semibold text-primary">{profile.tractionRating}</div>
          </div>
          <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
            <TrendingUp className="size-3.5" aria-hidden="true" />
            {profile.totalStars > 0 ? `${formatCompact(Math.round(profile.totalStars / Math.max(1, profile.publicRepos)))} ★/repo` : "New"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityVelocityCard({ profile }: { profile: ProfileAnalysis }) {
  // Map repos/year onto a 0-100 dial (20+/yr = full).
  const velocityPct = Math.min(100, Math.round((profile.reposPerYear / 20) * 100))
  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <CardHeader>
        <SectionTitle icon={Zap}>Activity Velocity</SectionTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-5">
          <ScoreRing value={velocityPct} label="index" />
          <div className="space-y-1">
            <div className="text-3xl font-semibold tabular-nums">{profile.reposPerYear}</div>
            <div className="text-sm font-medium">repos / year</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Avg. across {profile.accountAgeYears} years on GitHub
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
