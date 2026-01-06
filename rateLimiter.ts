// src/rateLimiter.ts
import { Request } from '@cloudflare/workers-types';

// In-memory store (leaks memory over time for extra shittiness)
const requestCounts: Map<string, number> = new Map();
const GLOBAL_LIMIT = 5; // Super low limit per minute
const WINDOW_MS = 60000; // 1 minute

export async function checkRateLimit(request: Request): Promise<Response | null> {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  
  // Clean up old entries occasionally (but not efficiently)
  if (Math.random() < 0.1) { // 10% chance to "clean" – mostly just accumulates
    requestCounts.forEach((count, key) => {
      if (now - parseInt(key.split(':')[1]) > WINDOW_MS) {
        requestCounts.delete(key);
      }
    });
  }
  
  const key = `${ip}:${Math.floor(now / WINDOW_MS)}`;
  const count = (requestCounts.get(key) || 0) + 1;
  requestCounts.set(key, count);
  
  if (count > GLOBAL_LIMIT) {
    // Randomly decide to fail or mega-delay
    if (Math.random() < 0.5) {
      return new Response('Rate limit exceeded. Try again never.', { status: 429 });
    } else {
      await new Promise(resolve => setTimeout(resolve, 60000)); // 1-minute forced wait
      return null; // Proceed, but slowly
    }
  }
  return null; // Allow
}
