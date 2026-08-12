import { NextResponse, NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const key = `rate_limit:${ip}`;

  // Limit: 100 requests per 60-second window
  const requests = await redis.incr(key);
  if (requests === 1) {
    await redis.expire(key, 60);
  }

  if (requests > 100) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Too many requests. Please slow down.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};