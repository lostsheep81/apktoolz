const { Queue } = require('bullmq');
const logger = require('../../config/logger');

const queueConfig = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
};

const decompilationQueue = new Queue('decompilation-queue', queueConfig);

console.log('Initialized decompilationQueue:', decompilationQueue);
logger.debug('Debug decompilationQueue instance:', decompilationQueue);

// Set up error handling
decompilationQueue.on('error', (error) => {
  logger.error('Queue error:', error);
});

decompilationQueue.on('failed', (job, error) => {
  logger.error('Job failed:', {
    jobId: job.id,
    error: error.message
  });
});

module.exports = {
  decompilationQueue
};
