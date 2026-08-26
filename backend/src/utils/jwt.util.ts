import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../models/user.model';

export interface JwtPayload {
  sub: number; // id del usuario
  email: string;
  rol: Role;
}

export function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.jwt.expiresIn as any };
  return jwt.sign(payload, env.jwt.secret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.jwt.secret);
  return decoded as unknown as JwtPayload;
}
