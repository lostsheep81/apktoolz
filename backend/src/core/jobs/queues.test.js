// Import Queue constructor for type checking, but rely on the global mock
const { Queue } = require('bullmq');
const logger = require('../../config/logger');

// Mock the logger directly in this file as well, ensures it overrides global if needed
// Or rely solely on the global mock from jest.setup.js
// jest.mock('../../config/logger');

// Mock the getMockQueueInstance function to return a valid mock queue instance
jest.mock('bullmq', () => ({
  Queue: jest.fn(),
  getMockQueueInstance: jest.fn(() => ({
    add: jest.fn(),
    process: jest.fn(),
    on: jest.fn(),
  })),
}));

// Import the module under test AFTER mocks are set up globally
const { decompilationQueue } = require('./queues');
// Get the mock instance created when './queues' was required
const { getMockQueueInstance } = require('bullmq');
const mockQueueInstance = getMockQueueInstance();


describe('decompilationQueue', () => {

  // Ensure the mock instance is defined
  if (!mockQueueInstance) {
    throw new Error("Mock BullMQ Queue instance was not created. Check jest.setup.js and module import order.");
  }

  beforeEach(() => {
    // Clear calls on the *specific* mock instance before each test
    jest.clearAllMocks(); // Clears calls on Queue/Worker constructors too
    // Manually clear calls on the instance methods if needed, especially if relying on emitted events
    mockQueueInstance.on.mockClear();
    mockQueueInstance.add.mockClear();
    // Clear logger mocks
    logger.info.mockClear();
    logger.error.mockClear();

  });

  it('should initialize a BullMQ queue with correct name and options', () => {
     // Check constructor call (happens globally when module is imported)
     expect(Queue).toHaveBeenCalledWith(
       'decompilation-queue',
       expect.objectContaining({
         connection: expect.any(Object)
       })
     );
     // Check the exported instance
     expect(decompilationQueue).toBeDefined();
     expect(decompilationQueue.name).toBe('decompilation-queue');
     // Check if the exported object is indeed our mock instance
     expect(decompilationQueue).toBe(mockQueueInstance);
  });

  it('should set up "error" and "failed" event handlers', () => {
     // Check if 'on' was called during the module's initialization phase
     expect(mockQueueInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
     expect(mockQueueInstance.on).toHaveBeenCalledWith('failed', expect.any(Function));
  });

  it('should log errors when the "error" event is triggered', () => {
    const mockError = new Error('Test queue error');

    // Find the 'error' handler registered on the mock instance
    const errorCall = mockQueueInstance.on.mock.calls.find(call => call[0] === 'error');
    expect(errorCall).toBeDefined();
    const errorHandler = errorCall[1];

    // Execute the handler
    errorHandler(mockError);

    // Verify logger was called
    expect(logger.error).toHaveBeenCalledWith('Queue error:', mockError);
  });

  it('should log errors and job details when the "failed" event is triggered', () => {
    const mockError = new Error('Test job failure');
    const mockJob = { id: 'test-job-id', name: 'decompile', data: { some: 'data' }, failedReason: 'It broke' };

    // Find the 'failed' handler
    const failedCall = mockQueueInstance.on.mock.calls.find(call => call[0] === 'failed');
    expect(failedCall).toBeDefined();
    const failedHandler = failedCall[1];

    // Execute the handler
    failedHandler(mockJob, mockError);

    // Verify logger was called
    // Note: The exact structure depends on the implementation in queues.js
    expect(logger.error).toHaveBeenCalledWith('Job failed:', expect.objectContaining({
        jobId: mockJob.id,
        // jobName: mockJob.name, // Uncomment if name is logged
        error: mockError,
        // failedReason: mockJob.failedReason // Uncomment if reason is logged
      }));
  });

  it('should expose a configured queue instance', () => {
    expect(decompilationQueue).toBe(mockQueueInstance);
    expect(decompilationQueue.add).toBeDefined();
  });

  it('should allow adding jobs to the queue', async () => {
    const jobData = { path: '/some/file.apk' };
    const jobOptions = { attempts: 3 };
    await decompilationQueue.add('analyzeApk', jobData, jobOptions);
    expect(mockQueueInstance.add).toHaveBeenCalledWith('analyzeApk', jobData, jobOptions);
  });

  it('should have an on method on decompilationQueue', () => {
    expect(typeof decompilationQueue.on).toBe('function');
  });

  console.log('Mocked Queue instance:', decompilationQueue);
});
