import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import dotenv from 'dotenv';
import userRouter from './routes/userroutes.js';
import imageRouter from './routes/imageRoute.js';

dotenv.config(); // must come before process.env is used

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Wrap DB connection and server start in async function
const startServer = async () => {
  try {
    await connectDB();  // connect to MongoDB
    console.log('Database connected successfully');

    // Routes
    app.use('/api/user', userRouter); // User routes
    app.use('/api/image', imageRouter);
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // exit if DB connection fails
  }
};  

startServer();