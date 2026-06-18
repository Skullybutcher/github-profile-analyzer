"use client"

import { CalendarDays, MapPin, Building2, LinkIcon, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { ProfileAnalysis } from "@/lib/types"
import { formatDate } from "@/lib/format"

export function ProfileHero({ profile }: { profile: ProfileAnalysis }) {
  const meta = [
    profile.company ? { icon: Building2, text: profile.company } : null,
    profile.location ? { icon: MapPin, text: profile.location } : null,
    { icon: CalendarDays, text: `Joined ${formatDate(profile.joinedAt)} · ${profile.accountAgeYears}y on GitHub` },
  ].filter(Boolean) as { icon: typeof MapPin; text: string }[]

  return (
    <Card className="overflow-hidden p-0 animate-fade-in-up">
      <div className="h-20 w-full bg-gradient-to-r from-primary/25 via-accent/15 to-transparent" />
      <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row">
        <Avatar className="-mt-12 size-24 rounded-2xl border-4 border-card shadow-lg ring-1 ring-border">
          <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} alt={profile.displayName} />
          <AvatarFallback className="rounded-2xl text-2xl">
            {profile.displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 sm:pt-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold leading-tight">{profile.displayName}</h2>
              <a
                href={profile.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary transition-colors hover:underline"
              >
                @{profile.username}
              </a>
            </div>
            <Button asChild variant="secondary" size="sm">
              <a href={profile.htmlUrl} target="_blank" rel="noopener noreferrer">
                View on GitHub
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
          </div>

          {profile.bio ? (
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {meta.map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5">
                <Icon className="size-4 shrink-0 text-primary/80" aria-hidden="true" />
                {text}
              </span>
            ))}
            {profile.blog ? (
              <a
                href={profile.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-accent transition-colors hover:underline"
              >
                <LinkIcon className="size-4 shrink-0" aria-hidden="true" />
                {profile.blog.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  )
}
