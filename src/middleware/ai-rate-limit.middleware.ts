import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * AI-specific rate limiter: 10 requests per minute per authenticated user.
 * This is a "circuit breaker" — even Enterprise users are subject to it.
 * Adjust windowMs and max as your infrastructure allows.
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per user per minute

  // Key by authenticated user ID, not by IP (shared offices would share an IP)
  keyGenerator: (req: Request) => {
    if ((req as any).user?.id) {
      return (req as any).user.id;
    }
    return ipKeyGenerator(req.ip || '');
  },

  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message:
        'AI request limit exceeded. You can make up to 10 AI requests per minute. Please wait and try again.',
      retryAfter: 60,
    });
  },

  // Don't count successful responses against the limit (optional, remove if too lenient)
  skipSuccessfulRequests: false,

  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
});
