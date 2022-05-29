import express, { json } from 'express';
import cors from 'cors';
import logger from 'morgan';
import helmet from 'helmet';
import config from './config';
import createHttpError from 'http-errors';
import routes from './routes';
import { errorMiddleware } from './middleware/error';

const appConfig = config.app;

const { app } = (() => {
  const app = express();

  // Logging Middleware
  app.use(logger('dev'));

  // Protects app from some well-known web vulnerabilities
  app.use(helmet());

  // Cors Middleware
  // https://expressjs.com/en/resources/middleware/cors.html
  // https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
  app.use(
    cors({
      // Access-Control-Allow-Origin
      // https://stackoverflow.com/questions/26988071/allow-multiple-cors-domain-in-express-js
      origin: appConfig.corsOrigins,
      credentials: true, // Access-Control-Allow-Credentials
    }),
  );

  // Middleware to parse incoming requests with JSON payloads
  app.use(
    json({
      limit: '100kb',
      strict: true,
      type: 'application/json',
    }),
  );

  // Register Routes
  app.use('/', routes);

  // Middleware to catch unregistered routes and respond with 404 error
  app.use((req, res, next) => {
    next(createHttpError(404)); // Go to next middleware (-> 'Error Handler Middleware' that was registered as last)
  });

  // Error Handler Middleware
  // https://expressjs.com/en/guide/error-handling.html
  app.use(errorMiddleware);

  return { app };
})();

export default app;
