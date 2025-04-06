// Mock dependencies first (relying on global mocks from jest.setup.js)
jest.mock('bullmq', () => ({
  Worker: jest.fn(),
  getMockWorkerInstance: jest.fn(() => ({
    on: jest.fn(),
  })),
}));
jest.mock('../config/logger');
// jest.mock('./jobHandler'); // Mock if job handler is separate

// Import the module containing startWorker
const workerModule = require('./worker');
// Import helpers/mocks from mocked libraries
const { Worker, getMockWorkerInstance } = require('bullmq');
const logger = require('../config/logger');

describe('Worker Process', () => {
  let startWorker; // Function under test
  let mockWorkerInstance; // Mock instance for assertions

  beforeAll(() => {
    // Verify that the worker instance is exported correctly
    if (!workerModule.worker) {
      throw new Error("Worker instance not found in ./worker.js. Expected module.exports = { worker }");
    }
  });

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Retrieve the current mock worker instance based on the bullmq mock
    testWorkerInstance = getMockWorkerInstance();
    if (!testWorkerInstance) {
      throw new Error("Failed to get mock worker instance. Check mock setup.");
    }
  });

  it('should initialize BullMQ Worker with correct queue name and connection options', () => {
    // If startWorker wasn't called in beforeEach, call it now.
    // startWorker(); // Remove if called in beforeEach
    // mockWorkerInstance = getMockWorkerInstance(); // Remove if instance fetched in beforeEach

    expect(testWorkerInstance).toBeDefined();

    // Check constructor call via the mock function itself
    expect(Worker).toHaveBeenCalledWith(
      'decompilation-queue',
      expect.any(Function), // The processor function
      expect.objectContaining({
        connection: expect.any(Object),
        // concurrency: expect.any(Number) // Add specific checks if needed
      })
    );
    // Check logger call if startWorker logs initialization
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Worker started'));
  });

  it('should attach event listeners for "completed", "failed", and "error"', () => {
    // If startWorker wasn't called in beforeEach, call it now.
    // startWorker(); // Remove if called in beforeEach
    // mockWorkerInstance = getMockWorkerInstance(); // Remove if instance fetched in beforeEach

    expect(testWorkerInstance).toBeDefined();

    // Check calls to the 'on' method of the mock instance
    expect(mockWorkerInstance.on).toHaveBeenCalledWith('completed', expect.any(Function));
    expect(mockWorkerInstance.on).toHaveBeenCalledWith('failed', expect.any(Function));
    expect(mockWorkerInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

   it('should log info when a job is completed', () => {
     // If startWorker wasn't called in beforeEach, call it now.
     // startWorker(); // Remove if called in beforeEach
     // mockWorkerInstance = getMockWorkerInstance(); // Remove if instance fetched in beforeEach
     expect(testWorkerInstance).toBeDefined();

     // Find the handler function registered with 'on'
     const completedHandler = testWorkerInstance.on.mock.calls.find(
       (call) => call[0] === "completed"
     )?.[1];
     expect(completedHandler).toBeInstanceOf(Function); // Ensure handler exists

     // Simulate the event by calling the handler
     const mockJob = { id: 'job123', name: 'decompile' };
     completedHandler(mockJob, 'someResult');

     // Assert logger call
     expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("Job completed:"), expect.any(Object));
   });

   it('should log an error when a job fails', () => {
     // If startWorker wasn't called in beforeEach, call it now.
     // startWorker(); // Remove if called in beforeEach
     // mockWorkerInstance = getMockWorkerInstance(); // Remove if instance fetched in beforeEach
     expect(testWorkerInstance).toBeDefined();

     const failedHandler = testWorkerInstance.on.mock.calls.find(
       (call) => call[0] === "failed"
     )?.[1];
     expect(failedHandler).toBeInstanceOf(Function);

     const mockJob = { id: 'job456', name: 'decompile', failedReason: 'Something broke' };
     const mockError = new Error('Processing failed');
     failedHandler(mockJob, mockError); // Simulate event

     // Assert logger call (adjust based on actual log message format in worker.js)
     expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Job failed:"), expect.anything());
   });


   it('should log an error when the worker encounters an error', () => {
     // If startWorker wasn't called in beforeEach, call it now.
     // startWorker(); // Remove if called in beforeEach
     // mockWorkerInstance = getMockWorkerInstance(); // Remove if instance fetched in beforeEach
     expect(testWorkerInstance).toBeDefined();

     const errorHandler = testWorkerInstance.on.mock.calls.find(
       (call) => call[0] === "error"
     )?.[1];
     expect(errorHandler).toBeInstanceOf(Function);

     const testError = new Error('Test worker error');
     errorHandler(testError); // Simulate event

     // Assert logger call
     expect(logger.error).toHaveBeenCalledWith('Worker error:', testError);
   });

  // Add test for the actual job processor function if possible
  // it('should process job using the processor function', async () => { ... });
});
