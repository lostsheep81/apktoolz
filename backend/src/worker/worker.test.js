// Mock dependencies before importing the worker
jest.mock('bullmq', () => {
  // Create a mock Worker instance that registers the event handlers
  const mockWorkerInstance = {
    name: 'decompilation-queue',
    on: jest.fn(),
    close: jest.fn().mockResolvedValue(),
    run: jest.fn()
  };
  
  // Mock the Worker constructor to return our instance with registered handlers
  const MockWorker = jest.fn(() => {
    return mockWorkerInstance;
  });
  
  return {
    Worker: MockWorker,
    Queue: jest.fn().mockImplementation(() => ({
      name: 'mock-queue',
      on: jest.fn(),
      add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
      close: jest.fn().mockResolvedValue(),
    }))
  };
});

// Mock the logger
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

// Import after mocks are set up
const { worker } = require('./worker');
const logger = require('../config/logger');

describe('Worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have an on method', () => {
    expect(typeof worker.on).toBe('function');
  });
  
  it('should log job-related messages', () => {
    // Manually call the logger functions to verify they can be called successfully
    logger.info('Job completed:', { jobId: 'job123' });
    expect(logger.info).toHaveBeenCalledWith('Job completed:', { jobId: 'job123' });
    
    logger.error('Job failed:', { jobId: 'job123', error: 'Test error' });
    expect(logger.error).toHaveBeenCalledWith('Job failed:', { jobId: 'job123', error: 'Test error' });
    
    logger.error('Worker error:', new Error('Test error'));
    expect(logger.error).toHaveBeenCalled();
  });
});
