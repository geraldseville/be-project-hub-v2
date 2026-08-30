import cors from 'cors';

export const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3000'];

export const corsConfig = cors({
  origin(origin, callback) {
    // Allow requests with no Origin (e.g. Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
});
