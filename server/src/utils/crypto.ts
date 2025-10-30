import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';

const ITERATIONS = 100_000;
const KEYLEN = 64;
const DIGEST = 'sha512';

export function hashPassword(plain: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex');
  const derived = pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return { hash: derived, salt };
}

export function verifyPassword(plain: string, hash: string, salt: string): boolean {
  const derived = pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(derived, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}
