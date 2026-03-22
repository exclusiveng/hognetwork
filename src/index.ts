import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import path from 'path';

// Config & Utils
import { AppDataSource } from './config/data-source';
import { AppError } from './utils/errors';

// Routes
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';

// Load environment variables
dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// --- Environment Validation ---
const hasDatabaseUrl = !!process.env.DATABASE_URL;
if (!hasDatabaseUrl && !process.env.DB_HOST) {
  console.warn('Warning: Database configuration is missing in .env');
}

// --- Security & Middleware ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// --- Routes ---
app.use('/api/admin', adminRoutes);
app.use('/api/site', publicRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), service: 'HogNetwork API' });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('HogNetwork API is running 🚀');
});

// --- Error Handling ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error('🔥 Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.method} ${req.url} not found`,
  });
});

// --- Server Startup ---
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('HogNetwork Data Source has been initialized!');

    app.listen(port, '0.0.0.0', () => {
      console.log(`
      ################################################
       HogNetwork API listening on port: ${port}
      ################################################
      `);
    });

  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
};

startServer();
