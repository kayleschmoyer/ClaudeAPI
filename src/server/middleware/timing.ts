import { Request, Response, NextFunction } from 'express';

export function timingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });

  next();
}
