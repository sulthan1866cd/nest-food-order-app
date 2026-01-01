import { NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: (error?: any) => void) {
    console.log(
      '\n\n',
      {
        path: req.baseUrl,
        method: req.method,
        body: req.body as object,
        auth: req.headers.authorization,
      },
      '\n\n',
    );
    next();
  }
}
