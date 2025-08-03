import { Request, Response, NextFunction } from 'express';

export function webhookCorsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const allowedOrigins = ['http://localhost:3000']; // Add more as needed
  const origin = req.headers.origin;

  // Handle allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Optional: fallback for tools like Postman in development
  if (!origin && process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}
