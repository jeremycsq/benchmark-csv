import type { TrafficData } from '@/composables/useSupabaseData'

export interface TrafficAuditReport {
  counts: {
    total: number
    byDevice: Record<string, number>
    hasAllDevices: boolean
  }
  fields: Record<string, { missing: number; invalid: number }>
  notes: string[]
}

const numericFields: Array<keyof TrafficData> = [
  'avg_daily_traffic',
  'yoy_change',
  'new_visitor_rate',
  'returning_visitor_rate',
  'mobile_share',
  'paid_traffic_share',
]

export function auditTrafficData(data: TrafficData[]): TrafficAuditReport {
  const notes: string[] = []
  const byDevice: Record<string, number> = {}

  const fields: Record<string, { missing: number; invalid: number }> = {}
  numericFields.forEach((f) => (fields[f] = { missing: 0, invalid: 0 }))

  for (const row of data) {
    const device = String(row.device ?? '').toLowerCase()
    byDevice[device] = (byDevice[device] || 0) + 1

    for (const f of numericFields) {
      const v = row[f] as unknown
      if (v === undefined || v === null || v === '') fields[f].missing++
      else if (typeof v !== 'number' || Number.isNaN(v)) fields[f].invalid++
    }
  }

  const hasAllDevices = Object.keys(byDevice).includes('all_devices')
  if (!hasAllDevices) {
    notes.push('Aucune ligne all_devices trouvée - bascule sur données par device (1/2).')
  }

  return {
    counts: { total: data.length, byDevice, hasAllDevices },
    fields,
    notes,
  }
}

export function logTrafficAudit(context: string, data: TrafficData[]) {
  const report = auditTrafficData(data)

  console.group(`🧪 Traffic Audit: ${context}`)

  console.table(report.fields)

  console.groupEnd()
  return report
}
