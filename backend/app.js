import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routerMovies from './routes/movies.js';
import routerUser from './routes/users.js';
import { createUser, login } from './controllers/users.js';
import { validateCreateUser, validateLogin } from './validation/users.js';
import NotFoundError from './errors/NotFoundError.js';
import requestLogger from './middlewares/logger.js';
import errorLogger from './middlewares/error.js';
import auth from './middlewares/auth.js';
import limiter from './middlewares/rateLimit.js';
import handlingError from './middlewares/handlingError.js';

const run = async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const app = express();
  const config = {
    PORT: 3000,
    HOST: 'localhost',
  };

  app.use(cors());
  app.use(requestLogger);
  app.use(cookieParser());
  app.use(express.json());
  app.get('/api/crash-test', () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  });
  app.post('/signup', validateCreateUser, createUser);
  app.post('/signin', validateLogin, login);
  app.use('/api/users', routerUser);
  app.use('/api/movies', routerMovies);
  app.all('*', auth, (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));
  app.use(errorLogger);
  app.use(errors());
  app.use(helmet());
  app.use(limiter);
  app.use(handlingError);

  const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/bitfilmsdb';
  mongoose.set('strictQuery', true);
  mongoose.set('runValidators', true);
  await mongoose.connect(DB_URL);
  const server = app.listen(config.PORT, config.HOST, () => {
    console.log(`Server run on http://${config.HOST}:${config.PORT}`);
  });

  const stop = async () => {
    await mongoose.connection.close();
    server.close();
    process.exit(0);
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};

run();
