import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { incrementSessionCount } from '../../../lib/supabase'

export async function POST() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  await incrementSessionCount(userId)
  return NextResponse.json({ ok: true })
}
