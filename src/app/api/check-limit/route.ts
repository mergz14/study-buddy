import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserPlan, getSessionsToday, FREE_LIMIT, PRO_LIMIT } from '../../../lib/supabase'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const [plan, usedToday] = await Promise.all([
    getUserPlan(userId),
    getSessionsToday(userId),
  ])

  const limit = plan === 'pro' ? PRO_LIMIT : FREE_LIMIT
  const allowed = usedToday < limit

  return NextResponse.json({ allowed, usedToday, limit, plan })
}
