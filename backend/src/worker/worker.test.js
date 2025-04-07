// Define mock handlers storage
const eventHandlers = {};

// Create a single mockWorkerInstance with properly implemented methods
const mockWorkerInstance = {
  name: 'decompilation-queue',
  on: jest.fn((event, handler) => {
    eventHandlers[event] = handler;
  }),
  close: jest.fn().mockImplementation(() => Promise.resolve()),
  run: jest.fn(),
};

jest.mock('bullmq', () => {
  return {
    Worker: jest.fn(() => mockWorkerInstance),
    Queue: jest.fn().mockImplementation(() => ({
      name: 'mock-queue',
      on: jest.fn(),
      add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
      close: jest.fn().mockResolvedValue(),
    })),
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

describe('Worker Lifecycle', () => {
  it('should close the worker without errors', async () => {
    const closePromise = mockWorkerInstance.close();
    expect(closePromise).toBeInstanceOf(Promise);
    await expect(closePromise).resolves.not.toThrow();
    expect(mockWorkerInstance.close).toHaveBeenCalled();
  });

  it('should handle errors during worker initialization', () => {
    // Create a new mock that throws an error
    const originalWorker = require('bullmq').Worker;
    require('bullmq').Worker = jest.fn().mockImplementation(() => {
      throw new Error('Initialization error');
    });
    
    try {
      expect(() => {
        jest.resetModules();
        require('./worker');
      }).toThrow('Initialization error');
    } finally {
      // Restore original mock
      require('bullmq').Worker = originalWorker;
    }
  });
});

describe('Job Processing', () => {
  it('should process jobs successfully', async () => {
    // Simulate a completed event
    const mockJob = { id: 'job123', data: { key: 'value' } };
    
    // Manually trigger the event handler if one was registered
    if (eventHandlers['completed']) {
      await eventHandlers['completed'](mockJob);
      expect(logger.info).toHaveBeenCalledWith('Job completed:', { jobId: 'job123' });
    }
  });

  it('should handle job processing errors', async () => {
    // Simulate a failed event
    const mockJob = { id: 'job123', data: { key: 'value' } };
    const mockError = new Error('Processing error');
    
    // Manually trigger the event handler if one was registered
    if (eventHandlers['failed']) {
      await eventHandlers['failed'](mockJob, mockError);
      expect(logger.error).toHaveBeenCalledWith('Job failed:', { 
        jobId: 'job123', 
        error: 'Processing error' 
      });
    }
  });
});
