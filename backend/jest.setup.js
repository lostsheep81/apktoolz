// Set Node environment to 'test'
process.env.NODE_ENV = 'test';

// Set other environment variables needed for tests
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.MONGODB_URI = 'mongodb://localhost:27017/apktoolz_test_db'; // Use a dedicated test DB URI
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.SESSION_SECRET = 'test-session-secret';
// Add any other required environment variables

// --- Global Mocks ---

// Ensure Schema.Types.Mixed is properly mocked
const MockSchemaTypes = {
  Mixed: {},
};

// Mock Mongoose
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');

  // Mock the Schema constructor and its methods
  const MockSchema = jest.fn((definition, options) => {
    const schemaInstance = new originalMongoose.Schema(definition, options);
    // Mock schema methods used in the codebase
    schemaInstance.pre = jest.fn().mockReturnThis(); // Mock 'pre' hook
    schemaInstance.methods = schemaInstance.methods || {}; // Ensure methods object exists
    // Copy actual schema methods if needed, or mock specific ones
    return schemaInstance;
  });

  // Mock the model function
  const MockModel = jest.fn((name, schema) => {
    // Return a mock model object with mocked static and instance methods
    const model = {
      // Static methods
      create: jest.fn().mockResolvedValue({ _id: 'mock_id', ...schema.obj }),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      // Add other static methods used in your code
    };
    // You might want to link the schema for instance methods if necessary
    model.schema = schema;
    return model;
  });

  return {
    ...originalMongoose, // Keep original parts if needed (like Types)
    Schema: MockSchema,
    model: MockModel,
    connect: jest.fn().mockResolvedValue({ connection: { host: 'mock-host' } }), // Mock connect
    disconnect: jest.fn().mockResolvedValue(), // Mock disconnect
    connection: {
      // Mock connection events if your app uses them
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn().mockResolvedValue(),
    },
    Types: MockSchemaTypes, // Add Types with Mixed
  };
});

 // Updated BullMQ Queue and Worker mocks with explicit 'on' method definition
jest.mock('bullmq', () => {
  return {
    Queue: jest.fn().mockImplementation((name, opts) => {
      return {
        name,
        opts,
        on: (event, callback) => {
          console.log(`Mocked Queue on method called for event: ${event}`);
        },
        add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
        close: jest.fn().mockResolvedValue(),
        process: jest.fn(),
      };
    }),
    Worker: jest.fn().mockImplementation((name, processor, opts) => {
      return {
        name,
        processor,
        opts,
        on: (event, callback) => {
          console.log(`Mocked Worker on method called for event: ${event}`);
        },
        close: jest.fn().mockResolvedValue(),
        run: jest.fn(),
      };
    }),
  };
});

// Mock Logger (ensure path matches your structure)
jest.mock('./src/config/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));


// --- Global Test Hooks ---

beforeAll(async () => {
  // Optional: Global setup before all tests run
  console.log('Starting Jest test suite...');
  // Example: Connect to a mock DB if needed (though mongoose.connect is mocked)
  // await require('mongoose').connect();
});

afterAll(async () => {
  // Optional: Global teardown after all tests run
  // Example: Disconnect mock DB
  // await require('mongoose').disconnect();
  console.log('Jest test suite finished.');
});

beforeEach(() => {
  // Optional: Setup before each test (runs after setupFilesAfterEnv)
  // Example: Resetting parts of mocks if restoreMocks doesn't cover everything
});

afterEach(() => {
  // Optional: Teardown after each test
  // Example: jest.clearAllTimers();
});
