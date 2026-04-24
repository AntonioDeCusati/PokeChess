import 'dotenv/config';
import { z } from 'zod';

/**
 * Runtime-validated environment. Fails loud at boot if anything is
 * missing or malformed. Every production-relevant knob is surfaced here
 * so `env` stays the single source of truth for config.
 */
const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(4000),

  /** Postgres connection string, e.g. `postgres://user:pass@host:5432/db`. */
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  /** Symmetric secret used to sign JWTs. Generate with `openssl rand -hex 48`. */
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  /**
   * Comma-separated list of allowed origins for CORS. Examples:
   *   - "http://localhost:5173"                     (dev)
   *   - "https://play.example.com,https://example.com" (prod)
   */
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((raw) =>
      raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),

  /**
   * When running behind a reverse proxy (nginx, Caddy, …) Express must
   * trust the proxy's `X-Forwarded-*` headers for req.ip/req.protocol
   * to reflect the real client. Values:
   *   - "0" / "false"     → no trust (default for local dev)
   *   - "1", "2", …       → trust N hops
   *   - "true"            → trust the first hop (most common behind one nginx)
   *   - an IP / CIDR list → trust those addresses (comma-separated)
   */
  TRUST_PROXY: z.string().default('0'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[env] invalid configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

/**
 * Translate the raw TRUST_PROXY string into the value Express expects.
 * See https://expressjs.com/en/guide/behind-proxies.html
 */
export function resolveTrustProxy(raw: string): boolean | number | string[] {
  const v = raw.trim();
  if (v === '' || v === '0' || v.toLowerCase() === 'false') return false;
  if (v.toLowerCase() === 'true') return true;
  const asInt = Number(v);
  if (Number.isInteger(asInt) && asInt > 0) return asInt;
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
