import Badge from '@/components/ui/Badge'
import { PressureZone } from '@/types'

interface PressureBadgeProps {
  score: number
  zone: PressureZone
}

export default function PressureBadge({ score, zone }: PressureBadgeProps) {
  return (
    <Badge zone={zone}>
      {score}
    </Badge>
  )
}
