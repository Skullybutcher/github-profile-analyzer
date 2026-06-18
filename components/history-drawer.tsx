"use client"

import { useEffect } from "react"
import { X, History, Trash2, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { HistoryEntry } from "@/lib/types"
import { relativeTime, languageColor } from "@/lib/format"

interface HistoryDrawerProps {
  open: boolean
  entries: HistoryEntry[]
  onClose: () => void
  onSelect: (username: string) => void
  onClear: () => void
}

export function HistoryDrawer({ open, entries, onClose, onSelect, onClear }: HistoryDrawerProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <div className={open ? "pointer-events-auto" : "pointer-events-none"} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Previously analyzed profiles"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <History className="size-5 text-primary" aria-hidden="true" />
            <h2 className="font-semibold">Analysis History</h2>
            <Badge variant="secondary" className="ml-1">{entries.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close history">
            <X className="size-5" />
          </Button>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Clock className="mb-3 size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              No profiles analyzed yet. Your history will appear here.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <ul className="divide-y divide-border">
                {entries.map((entry) => (
                  <li key={entry.username}>
                    <button
                      type="button"
                      onClick={() => onSelect(entry.username)}
                      className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-secondary/60"
                    >
                      <Avatar className="size-10 rounded-xl">
                        <AvatarImage src={entry.avatarUrl || "/placeholder.svg"} alt={entry.displayName} />
                        <AvatarFallback className="rounded-xl">
                          {entry.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{entry.displayName}</span>
                          <span className="truncate text-xs text-muted-foreground">@{entry.username}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: languageColor(entry.dominantLanguage) }}
                              aria-hidden="true"
                            />
                            {entry.dominantLanguage}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{relativeTime(entry.analyzedAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold tabular-nums text-primary">
                          {entry.engagementScore}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">score</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <div className="border-t border-border p-4">
              <Button variant="ghost" size="sm" onClick={onClear} className="w-full text-muted-foreground hover:text-destructive">
                <Trash2 className="size-4" aria-hidden="true" />
                Clear history
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
