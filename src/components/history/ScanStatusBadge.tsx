import type { ScanRecord } from '../../types'
import { statusMeta } from '../../lib/status'
import type { BadgeTone } from '../ui/Badge'
import { Badge } from '../ui/Badge'

export function ScanStatusBadge({
  status,
}: {
  status: ScanRecord['status']
}) {
  return (
    <Badge tone={statusMeta[status].tone as BadgeTone} dot>
      {statusMeta[status].label}
    </Badge>
  )
}