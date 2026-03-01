import Card from '@/components/ui/Card'
import PressureTimeline from '@/components/insights/PressureTimeline'
import BehaviorPatterns from '@/components/insights/BehaviorPatterns'

export default function InsightsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight font-display">
          Insights
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          How you work under pressure.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-4">
          Pressure over time
        </h2>
        <Card>
          <PressureTimeline />
        </Card>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-4">
          Behavior patterns
        </h2>
        <BehaviorPatterns />
      </section>
    </div>
  )
}
