import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const { code, paymentIntentId, originalAmount } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Please enter a coupon code.' })
    }

    // Try promotion codes first (user-facing codes like "SAVE20")
    const promoCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1,
    })

    let coupon: Stripe.Coupon | null = null

    if (promoCodes.data.length > 0) {
      coupon = promoCodes.data[0].coupon
    } else {
      // Fall back to direct coupon ID lookup
      try {
        const retrieved = await stripe.coupons.retrieve(code)
        if (retrieved.valid) coupon = retrieved
      } catch {
        coupon = null
      }
    }

    if (!coupon || !coupon.valid) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired coupon code.' })
    }

    // Calculate discount in cents
    let discountAmount = 0
    if (coupon.percent_off) {
      discountAmount = Math.round(originalAmount * (coupon.percent_off / 100))
    } else if (coupon.amount_off) {
      discountAmount = Math.min(coupon.amount_off, originalAmount)
    }

    const finalAmount = Math.max(originalAmount - discountAmount, 50) // Stripe minimum is $0.50

    // Update the existing payment intent with the discounted amount
    if (paymentIntentId) {
      await stripe.paymentIntents.update(paymentIntentId, { amount: finalAmount })
    }

    return NextResponse.json({
      valid: true,
      discountAmount,
      finalAmount,
      couponName: coupon.name || code.toUpperCase(),
    })
  } catch (err) {
    console.error('[validate-coupon]', err)
    return NextResponse.json({ valid: false, error: 'Failed to validate coupon. Please try again.' })
  }
}
