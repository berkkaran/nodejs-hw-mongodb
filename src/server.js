import express from 'express';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    res.json({
      status: 200,
      message: 'Hello world!',
    });
  });

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = env('PORT', '3000');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default setupServer;
