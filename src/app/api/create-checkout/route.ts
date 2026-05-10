import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

  // Get or create Stripe customer
  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('stripe_customer_id')
    .eq('clerk_id', userId)
    .single()

  let customerId = sub?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({ metadata: { clerk_id: userId } })
    customerId = customer.id
    await supabase.from('user_subscriptions').upsert({
      clerk_id: userId, stripe_customer_id: customerId, plan: 'free'
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/app?upgraded=true`,
    cancel_url: `${baseUrl}/app`,
  })

  return NextResponse.json({ url: session.url })
}
