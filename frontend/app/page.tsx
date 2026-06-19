import { AnalyzerDashboard } from "@/components/analyzer-dashboard"
import { Toaster } from "@/components/ui/sonner"

export default function Page() {
  return (
    <>
      <AnalyzerDashboard />
      <Toaster position="bottom-right" />
    </>
  )
}
