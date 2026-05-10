import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const FREE_LIMIT = 5
export const PRO_LIMIT = 20

export async function getUserPlan(clerkId: string): Promise<'free' | 'pro'> {
  const { data } = await supabase
    .from('user_subscriptions')
    .select('plan')
    .eq('clerk_id', clerkId)
    .single()
  return (data?.plan as 'free' | 'pro') ?? 'free'
}

export async function getSessionsToday(clerkId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('session_counts')
    .select('count')
    .eq('clerk_id', clerkId)
    .eq('date', today)
    .single()
  return data?.count ?? 0
}

export async function incrementSessionCount(clerkId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  await supabase.rpc('increment_session_count', { p_clerk_id: clerkId, p_date: today })
}
