import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  const getClerkId = async (customerId: string) => {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
    return customer.metadata?.clerk_id ?? null
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const clerkId = await getClerkId(sub.customer as string)
    if (clerkId) {
      const plan = sub.status === 'active' ? 'pro' : 'free'
      await supabase.from('user_subscriptions').upsert({
        clerk_id: clerkId,
        plan,
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer as string,
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const clerkId = await getClerkId(sub.customer as string)
    if (clerkId) {
      await supabase.from('user_subscriptions').upsert({ clerk_id: clerkId, plan: 'free' })
    }
  }

  return NextResponse.json({ received: true })
}
