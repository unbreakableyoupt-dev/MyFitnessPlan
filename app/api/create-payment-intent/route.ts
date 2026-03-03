import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const TIER_AMOUNTS: Record<string, number> = {
  training_only: 1900,        // $19.00
  transformation_pack: 2900,  // $29.00
}

export async function POST(req: Request) {
  try {
    const { tierId } = await req.json()
    const amount = TIER_AMOUNTS[tierId] ?? 1900

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[create-payment-intent]', err)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
