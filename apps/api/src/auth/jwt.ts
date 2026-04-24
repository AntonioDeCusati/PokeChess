import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../env';

export interface JwtPayload {
  sub: string; // user id
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded !== 'object' || decoded === null || typeof (decoded as JwtPayload).sub !== 'string') {
    throw new Error('Malformed token payload');
  }
  return { sub: (decoded as JwtPayload).sub };
}
