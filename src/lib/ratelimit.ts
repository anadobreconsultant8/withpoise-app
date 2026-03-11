import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

function createLimiter(requests: number, window: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null // not configured — skip in local dev
  }
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
  })
}

// 5 registration attempts per hour per IP
export const registerLimiter = createLimiter(5, '1 h')

// 10 login attempts per 15 minutes per IP
export const loginLimiter = createLimiter(10, '15 m')

// 30 generations per minute per user
export const generateLimiter = createLimiter(30, '1 m')

// 3 forgot-password attempts per hour per IP
export const forgotPasswordLimiter = createLimiter(3, '1 h')

// 5 reset-password attempts per 15 minutes per IP
export const resetPasswordLimiter = createLimiter(5, '15 m')

export async function applyRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<NextResponse | null> {
  if (!limiter) return null

  const { success, reset } = await limiter.limit(identifier)

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      },
    )
  }

  return null
}
