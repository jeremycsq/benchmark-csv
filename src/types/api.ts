export interface ApiResponse {
  metrics: {
    avg_daily_traffic: number
    yoy_change: number
    mom_change: number
    new_visitor_rate: number
    returning_visitor_rate: number
    new_visitor_yoy_change: number
    new_visitor_mom_change: number
  }
  mobile_metrics: {
    mobile_share: number
    mobile_yoy_change: number
    mobile_mom_change: number
  }
  paid_traffic_metrics: {
    paid_traffic_share: number
    paid_traffic_yoy_change: number
    paid_traffic_mom_change: number
  }
  traffic_share_by_channel: Record<string, number>
  bounce_rate_by_channel: Record<string, number>
  channel_yoy_changes: Record<string, number>
  device_distribution: Record<string, number>
  percentile_rank: number
  metadata: {
    analysis_month: string
    country_code: string | null
    country_display: string
    project_count: number
    last_calculated: string
    data_source: string
    response_time_ms: number
  }
}
