/**
 * Global Jest Setup for Backend Tests
 *
 * This file establishes the testing environment and mocks out modules that may
 * otherwise create side effects or dependencies during tests. It serves as a
 * central place for setting environment variables, initializing global mocks,
 * and defining global hooks to ensure that tests run in an isolated and predictable manner.
 *
 * Self-Healing & Self-Refinement:
 * - Environment variables and mocks are clearly defined here, with inline documentation
 *   to help troubleshoot issues when tests fail.
 * - This setup supports a self-healing test infrastructure that resets state and monitors
 *   for open handles or issues during test execution.
 * - Consider splitting this file into environment-specific setups if future needs diverge.
 */
 
// ---------- Environment Configuration ----------

// Set Node environment to 'test' which signals to libraries that this is a testing instance.
process.env.NODE_ENV = 'test';

// Set other environment variables needed for tests
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.MONGODB_URI = 'mongodb://localhost:27017/apktoolz_test_db';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.SESSION_SECRET = 'test-session-secret';

// --- Global Mocks ---

 // Mock for bcrypt to provide consistent behavior without depending on the installed module.
// Using jest.doMock allows us to override the implementation without needing the real module installed.
const mockBcrypt = {
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
};
jest.doMock('bcrypt', () => mockBcrypt);

 // Mock for Mongoose to avoid real database connections and to simulate schema behavior.
 // Here we extend the Schema mock to include explicit support for Mixed types.
 // This self-healing approach prevents database I/O during tests.
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  
  // Create a MockSchema that mimics Mongoose's Schema with custom additions.
  const MockSchema = jest.fn((definition, options) => {
    const schemaInstance = new originalMongoose.Schema(definition, options);
    // Override the pre hook to be a jest mock to avoid actual middleware execution.
    schemaInstance.pre = jest.fn().mockReturnThis();
    schemaInstance.methods = schemaInstance.methods || {};
    return schemaInstance;
  });
  
  // Define Types with support for Mixed and other basic types.
  MockSchema.Types = {
    Mixed: {},
    ObjectId: String,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date
  };

  // Create a MockModel to simulate Mongoose model operations.
  const MockModel = jest.fn((name, schema) => ({
    create: jest.fn().mockResolvedValue({ _id: 'mock_id', ...schema.obj }),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    schema
  }));

  return {
    Schema: MockSchema,
    model: MockModel,
    connect: jest.fn().mockResolvedValue({ connection: { host: 'mock-host' } }),
    disconnect: jest.fn().mockResolvedValue(),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn().mockResolvedValue()
    },
    // Expose Types for external access
    Types: MockSchema.Types
  };
});

 // Enhance BullMQ mocks to simulate queue and worker behavior without real connectivity.
 // Both Queue and Worker mocks include an 'on' method to simulate event listener registration.
jest.mock('bullmq', () => {
  return {
    Queue: jest.fn().mockImplementation((name, opts) => {
      return {
        name,
        opts,
        on: jest.fn((event, callback) => {
          console.log(`Mocked Queue on method called for event: ${event}`);
          return this;
        }),
        add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
        close: jest.fn().mockResolvedValue(),
        process: jest.fn()
      };
    }),
    Worker: jest.fn().mockImplementation((name, processor, opts) => {
      return {
        name,
        processor,
        opts,
        on: jest.fn((event, callback) => {
          console.log(`Mocked Worker on method called for event: ${event}`);
          return this;
        }),
        close: jest.fn().mockResolvedValue(),
        run: jest.fn()
      };
    })
  };
});

 // Mock Logger to intercept and simulate logging during tests.
 // This prevents real logging and allows test assertions on log outputs if needed.
jest.mock('./src/config/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

 // ---------- Global Test Hooks ----------

// beforeAll hook to execute any initialization routines before the test suite runs.
// Here we simply log the start of the test suite, which can be expanded as needed.
beforeAll(async () => {
  console.log('Starting Jest test suite...');
});

// afterAll hook to perform cleanup once all tests have finished.
afterAll(async () => {
  console.log('Jest test suite finished.');
});

// beforeEach hook to reset all mocks between tests.
// This self-healing measure ensures that state from one test does not bleed into another.
beforeEach(() => {
  jest.clearAllMocks();
});
