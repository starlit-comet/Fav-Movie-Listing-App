export const PORT = Number(process.env.PORT || '') || 4000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Password hashing config for seeding/defaults
export const PASSWORD_SALT = process.env.PASSWORD_SALT || '10';
export const PBKDF2_ITERATIONS = Number(process.env.PBKDF2_ITERATIONS || '') || 100_000;
export const PBKDF2_KEYLEN = Number(process.env.PBKDF2_KEYLEN || '') || 64;
export const PBKDF2_DIGEST = (process.env.PBKDF2_DIGEST || 'sha512') as 'sha1' | 'sha256' | 'sha512';
