// Simple token-bucket rate limiter per user (in-memory)
// Note: in-memory limits won't work across multiple instances; for production use Redis or similar.

const buckets = new Map();

// configuration (can be tuned via env)
const RATE_LIMIT_TOKENS = parseInt(process.env.RATE_LIMIT_TOKENS || '5', 10); // tokens per window
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '60', 10); // window seconds

function rateLimiter(req, res, next) {
  try {
    const userId = req.userId || 'anon';
    const now = Date.now() / 1000;
    let bucket = buckets.get(userId);
    if (!bucket) {
      bucket = { tokens: RATE_LIMIT_TOKENS, last: now };
      buckets.set(userId, bucket);
    }

    // refill
    const elapsed = now - bucket.last;
    if (elapsed > 0) {
      const refill = (elapsed / RATE_LIMIT_WINDOW) * RATE_LIMIT_TOKENS;
      bucket.tokens = Math.min(RATE_LIMIT_TOKENS, bucket.tokens + refill);
      bucket.last = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      next();
    } else {
      res.status(429).json({ message: '请求过多，请稍后再试（速率限制）' });
    }
  } catch (err) {
    console.error('rateLimiter error', err);
    next();
  }
}

module.exports = rateLimiter;
