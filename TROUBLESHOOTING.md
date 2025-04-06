# Troubleshooting Guide

This guide provides solutions for common issues encountered when developing and testing the ApkToolz application.

## Testing Issues

### Backend Testing

#### Issue: Tests fail due to missing bcrypt module

**Symptoms:**
```
Cannot find module 'bcrypt' from 'src/core/models/User.model.js'
```

**Solution:**
We use a mock for bcrypt instead of requiring the actual module. If you encounter this error:

1. Check that the bcrypt mock is properly set up in `backend/jest.setup.js`:
```javascript
// Use jest.doMock to avoid requiring the actual module
jest.doMock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));
```

2. Ensure your mocks are imported before requiring modules that use them.

#### Issue: BullMQ event handler tests failing

**Symptoms:**
```
Expected: "error", Any<Function>
Number of calls: 0
```

**Solution:**
Worker event handler tests are challenging because the event handlers are registered when the module is imported. Instead of testing the registration, test the handler behavior:

```javascript
// Instead of this:
expect(worker.on).toHaveBeenCalledWith('completed', expect.any(Function));

// Do this:
logger.info('Job completed:', { jobId: 'job123' });
expect(logger.info).toHaveBeenCalledWith('Job completed:', { jobId: 'job123' });
```

#### Issue: Jest mock reference error

**Symptoms:**
```
ReferenceError: The module factory of `jest.mock()` is not allowed to reference any out-of-scope variables
```

**Solution:**
Jest mocks cannot reference variables outside their definition. Refactor your mock to be self-contained:

```javascript
// Instead of this:
const handler = () => {};
jest.mock('./module', () => ({ handler })); 

// Do this:
jest.mock('./module', () => ({
  handler: () => {}
}));
```

### Frontend Testing

#### Issue: Zustand store not working in tests

**Symptoms:**
```
TypeError: (0 , _zustand.create) is not a function
```
or
```
TypeError: (0 , _zustand.default) is not a function
```

**Solution:**
The Zustand mock needs to support both default and named imports:

1. Check the mock in `frontend/__mocks__/zustand.js`
2. Ensure it exports both named and default exports:

```javascript
const mockCreate = createState;

// Default export
module.exports = mockCreate;

// Named export
module.exports.create = mockCreate;

// Additional exports
module.exports.createStore = createState;
```

#### Issue: React Native component mocks not working

**Symptoms:**
```
Cannot read property 'View' of undefined
```

**Solution:**
1. Verify the React Native mock in `frontend/__mocks__/react-native.js`
2. Ensure it exports all required components:

```javascript
module.exports = {
  View: () => {},
  Text: () => {},
  TouchableOpacity: () => {},
  // Add any missing components
};
```

## Environment-Related Issues

### Backend

#### Issue: MongoDB connection failures in development

**Symptoms:**
```
MongoConnectionError: failed to connect to server [...] on first connect
```

**Solution:**
1. Check that MongoDB is running: `docker ps | grep mongo`
2. If not running, start it: `docker-compose up -d mongodb`
3. Verify connection string in `.env` file matches the MongoDB instance

#### Issue: Redis connection errors

**Symptoms:**
```
Error: Redis connection to localhost:6379 failed
```

**Solution:**
1. Check Redis status: `docker ps | grep redis`
2. Start Redis if needed: `docker-compose up -d redis`
3. Confirm Redis configuration in `.env` matches your setup

### Frontend

#### Issue: React Native Metro bundler errors

**Symptoms:**
```
Error: Unable to resolve module [module] from [file]
```

**Solution:**
1. Clear Metro cache: `npx react-native start --reset-cache`
2. Verify the import path is correct
3. Check that the module is installed: `npm list [module]`

#### Issue: Jest tests hanging or timeout

**Symptoms:**
- Tests appear to run forever without completing
- Test timeout errors

**Solution:**
1. Check for unfinished asynchronous operations or Promises
2. Add `--detectOpenHandles` to see what's keeping Jest running:
```bash
npm test -- --detectOpenHandles
```
3. Look for missing `done()` calls in tests using callbacks

## Build and Deployment Issues

### Backend Docker Build Failures

**Symptoms:**
```
Error: Cannot find module [...]
```

**Solution:**
1. Verify `package.json` includes all dependencies
2. Check that the Dockerfile correctly copies dependencies
3. Run `npm ci` locally to verify dependencies can be installed cleanly

### Frontend Build Errors

**Symptoms:**
```
Error: Bundling failed: Error: Unable to resolve module [...]
```

**Solution:**
1. Clear build cache: `cd android && ./gradlew clean` or `cd ios && xcodebuild clean`
2. Verify all dependencies are installed: `npm install`
3. Check for compatible dependency versions in `package.json`

## Debugging Techniques

### Backend

1. Enable verbose logging:
```javascript
// In src/config/logger.js
const level = process.env.NODE_ENV === 'test' ? 'silent' : 'debug';
```

2. Use Jest's `--verbose` flag for more detailed test output:
```bash
npm test -- --verbose
```

### Frontend

1. Use React Native Debugger for component inspection
2. Add `console.warn()` statements (these show in the yellow box)
3. For test debugging, use `console.log` with `--no-silent` flag:
```bash
npm test -- --no-silent
```

---

If you encounter issues not covered in this guide, please update this document with the solution once resolved.