import { Request, Response } from 'express';
import jwt, { Secret,SignOptions } from 'jsonwebtoken';
// import * as jwt from 'jsonwebtoken';
import { User } from '../models';
import { verifyPassword } from '../utils/crypto';
import { pbkdf2Sync } from 'crypto';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
const PASSWORD_SALT = "10"

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = verifyPassword(password, user.passwordHash, PASSWORD_SALT);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { sub: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      
      },
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password using the current scheme (static PASSWORD_SALT with PBKDF2 params from utils)
    const ITERATIONS = 100_000;
    const KEYLEN = 64;
    const DIGEST = 'sha512';
    const hash = pbkdf2Sync(password, PASSWORD_SALT, ITERATIONS, KEYLEN, DIGEST).toString('hex');

    const created = await User.create({ name, email, passwordHash: hash });

    const token = jwt.sign(
      { sub: created.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      token,
      user: {
        id: created.id,
        email: created.email,
        name: created.name,
      },
    });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
