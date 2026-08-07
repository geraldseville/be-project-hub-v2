import express from 'express';
import cookieParser from 'cookie-parser';

import { corsConfig } from './config/cors';
import routes from './routes/index';

const app = express();

app.use(corsConfig);

app.use(express.json());

app.use(cookieParser());

app.get('/', (_, res) => {
  res.json({
    message: 'Project Hub V2',
  });
});

app.use('/api', routes);

export default app;
