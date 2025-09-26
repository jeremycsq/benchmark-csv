import { createClient } from '@supabase/supabase-js'
import { env, validateEnv } from '../config/env'

// Validation de la configuration
validateEnv()

export const supabase = createClient(env.supabase.url, env.supabase.anonKey)

// Types pour vos tables
export interface Database {
  public: {
    Tables: {
      traffic: {
        Row: {
          id: number
          analysis_month: string
          country: string
          industry: string
          device: string
          avg_daily_traffic: number
          yoy_change: number
          mom_change: string
          new_visitor_rate: number
          returning_visitor_rate: number
          new_visitor_yoy_change: number
          new_visitor_mom_change: string
          mobile_share: number
          mobile_yoy_change: number
          mobile_mom_change: string
          paid_traffic_share: number
          paid_traffic_yoy_change: number
          paid_traffic_mom_change: string
          traffic_share_by_channel: any
          bounce_rate_by_channel: any
          channel_yoy_changes: any
          device_distribution: any
          percentile_rank: number
          project_count: number
          calculation_timestamp: string
        }
        Insert: {
          id?: number
          analysis_month: string
          country: string
          industry: string
          device: string
          avg_daily_traffic: number
          yoy_change: number
          mom_change: string
          new_visitor_rate: number
          returning_visitor_rate: number
          new_visitor_yoy_change: number
          new_visitor_mom_change: string
          mobile_share: number
          mobile_yoy_change: number
          mobile_mom_change: string
          paid_traffic_share: number
          paid_traffic_yoy_change: number
          paid_traffic_mom_change: string
          traffic_share_by_channel: any
          bounce_rate_by_channel: any
          channel_yoy_changes: any
          device_distribution: any
          percentile_rank: number
          project_count: number
          calculation_timestamp?: string
        }
        Update: {
          id?: number
          analysis_month?: string
          country?: string
          industry?: string
          device?: string
          avg_daily_traffic?: number
          yoy_change?: number
          mom_change?: string
          new_visitor_rate?: number
          returning_visitor_rate?: number
          new_visitor_yoy_change?: number
          new_visitor_mom_change?: string
          mobile_share?: number
          mobile_yoy_change?: number
          mobile_mom_change?: string
          paid_traffic_share?: number
          paid_traffic_yoy_change?: number
          paid_traffic_mom_change?: string
          traffic_share_by_channel?: any
          bounce_rate_by_channel?: any
          channel_yoy_changes?: any
          device_distribution?: any
          percentile_rank?: number
          project_count?: number
          calculation_timestamp?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
      }
    }
  }
}
