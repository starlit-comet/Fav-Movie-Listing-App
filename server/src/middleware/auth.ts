import { Request, Response, NextFunction } from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

const SECRET = JWT_SECRET;

// type JwtPayload = { sub: number; role?: string; iat?: number; exp?: number };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    (req as any).user = { id: decoded.sub, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
