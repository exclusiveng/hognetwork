import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { ApiKey } from '../entities/api-key.entity';
import crypto from 'crypto';

export interface ScanRequest extends Request {
  companyId?: string;
  apiKeyId?: string;
}

export const apiKeyAuth = async (
  req: ScanRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route. API Key is missing.',
    });
  }

  try {
    const keyHash = crypto.createHash('sha256').update(token).digest('hex');

    const apiKeyRepo = AppDataSource.getRepository(ApiKey);
    const apiKey = await apiKeyRepo.findOne({
      where: { keyHash },
      select: ['id', 'companyId', 'isActive'],
    });

    if (!apiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid API Key.',
      });
    }

    if (!apiKey.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'API Key has been revoked or is inactive.',
      });
    }

    // Attach companyId and apiKeyId to the request for the controller 
    req.companyId = apiKey.companyId;
    req.apiKeyId = apiKey.id;

    // Asynchronously update lastUsedAt to not block the request
    apiKeyRepo.update(apiKey.id, { lastUsedAt: new Date() }).catch((err) => {
      console.error('Failed to update API Key lastUsedAt:', err);
    });

    next();
  } catch (error) {
    console.error('API Key Auth Middleware Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication.',
    });
  }
};
