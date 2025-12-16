import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Router } from 'express';
// const bt = async () => {
//   const user = Router();
//   user.get('/a', (req, res) => {
//     res.send('hellp');
//   });
//   const app = await NestFactory.create(AppModule);
//   app.use('/w', user);
//   await app.listen(process.env.PORT ?? 3000);
// };
// bt();
