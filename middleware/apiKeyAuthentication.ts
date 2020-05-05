import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import APIKey from '../models/APIKey';

async function apiKeyAuthentication(req: Request, res: Response, next: NextFunction): Promise<void> {
  const apiKey: string = req.header('X-Api-Key');

  if (!apiKey) res.status(400).send('Please provide an API key');

  await mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

  const db = mongoose.connection;

  try {
    const hasApiKey: boolean = await APIKey.exists({ apiKey });

    if (hasApiKey) {
      await db.close();
      next();
    } else res.status(401).send('Invalid API key');
  } catch (error) {
    res.status(500).send(error);
  }

  if (db.readyState === 1) db.close();
}

export default apiKeyAuthentication;
