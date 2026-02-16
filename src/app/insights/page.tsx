import Card from '@/components/ui/Card'
import PressureTimeline from '@/components/insights/PressureTimeline'
import BehaviorPatterns from '@/components/insights/BehaviorPatterns'

export default function InsightsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-8">
        Insights
      </h1>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
          Pressure Over Time
        </h2>
        <Card>
          <PressureTimeline />
        </Card>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
          Behavior Patterns
        </h2>
        <BehaviorPatterns />
      </section>
    </div>
  )
}
