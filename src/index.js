import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import setupServer from './server.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
