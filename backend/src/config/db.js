const mongoose = require('mongoose');
const Redis = require('ioredis');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Redis client configuration
const createRedisClient = () => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    }
  });

  redis.on('error', (err) => logger.error('Redis Client Error', err));
  redis.on('connect', () => logger.info('Redis Client Connected'));
  
  return redis;
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    logger.info('MongoDB connected successfully');
    
    return createRedisClient();
  } catch (err) {
    logger.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = { connectDB, createRedisClient };