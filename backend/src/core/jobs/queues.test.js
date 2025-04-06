// Mock bullmq directly in this file to ensure it's applied correctly
jest.mock('bullmq', () => {
  const mockQueue = {
    name: 'decompilation-queue',
    on: jest.fn(),
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
    process: jest.fn(),
    close: jest.fn().mockResolvedValue(),
  };

  return {
    Queue: jest.fn().mockImplementation(() => mockQueue)
  };
});

// Import here after the mock is set up
const { decompilationQueue } = require('./queues');
const logger = require('../../config/logger');

describe('decompilationQueue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have an on method', () => {
    expect(typeof decompilationQueue.on).toBe('function');
  });

  it('should allow adding jobs to the queue', async () => {
    const jobData = { path: '/path/to/file.apk' };
    const options = { attempts: 3 };
    
    await decompilationQueue.add('analyzeApk', jobData, options);
    
    expect(decompilationQueue.add).toHaveBeenCalledWith('analyzeApk', jobData, options);
  });
});
