import { Request, Response, NextFunction } from 'express';
import APIKey from '../models/APIKey';

async function apiKeyAuthentication(req: Request, res: Response, next: NextFunction): Promise<void> {
  const apiKey: string = req.header('X-Api-Key');

  if (!apiKey) res.status(400).send('Please provide an API key');

  try {
    const hasApiKey: boolean = await APIKey.exists({ apiKey });

    if (hasApiKey) next();
    else res.status(401).send('Invalid API key');
  } catch (error) {
    res.status(500).send(error);
  }
}

export default apiKeyAuthentication;
