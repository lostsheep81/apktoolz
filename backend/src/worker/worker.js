const { Worker } = require('bullmq');
const { execFile } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const ApkAnalysisService = require('../core/services/ApkAnalysisService');
const { processApk } = require('./aiAnalysis');

const execFileAsync = util.promisify(execFile);

const worker = new Worker(
  'decompilation-queue',
  async (job) => {
    try {
      return await processApk(job.data);
    } catch (error) {
      logger.error('Job processing error:', error);
      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    },
    autorun: true
  }
);

worker.on('error', (error) => {
  logger.error('Worker error:', error);
});

worker.on('failed', (job, error) => {
  logger.error('Job failed:', { jobId: job.id, error: error.message });
});

worker.on('completed', (job) => {
  logger.info('Job completed:', { jobId: job.id });
});

module.exports = { worker };