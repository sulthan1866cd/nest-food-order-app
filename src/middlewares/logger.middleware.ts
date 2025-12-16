import { NestMiddleware } from '@nestjs/common';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: (error?: any) => void) {
    console.log('\n\n', { path: req.url, body: req.body }, '\n\n');
    next();
  }
}
