import path from 'path';

import cors from 'cors';
import express, { type Request, type Response, type Express } from 'express';
import helmet from 'helmet';

import { env } from './config/envConfig';
import { errorConverter, errorHandler } from './middlewares/error';
import routes from './routes/v1';
import ApiError from './utils/ApiError';

const app: Express = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Home route - serve dashboard.html
app.get('/', (_req: Request, res: Response) => {
  console.log(
    'Serving dashboard from:',
    path.join(__dirname, 'public', 'dashboard.html'),
  );
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API routes
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

app.use(errorHandler);

export default app;
