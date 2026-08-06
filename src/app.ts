import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from './routes/index';

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.get('/', (_, res) => {
  res.json({
    message: 'Project Hub V2',
  });
});

app.use('/api', routes);

export default app;
