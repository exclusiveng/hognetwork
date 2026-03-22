import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const signToken = (user: User): string => {
  const payload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
