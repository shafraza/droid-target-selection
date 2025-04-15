import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found 🚫',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ Unexpected error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;