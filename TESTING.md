# Testing Framework Documentation

This document provides an overview of the testing framework used in the ApkToolz project, covering both backend and frontend testing. It includes information about the current setup, common issues and their solutions, and best practices for writing new tests.

## Overview

The project uses Jest as the primary testing framework for both backend and frontend. The testing setup includes:

- **Unit Tests**: For testing individual functions and components
- **Integration Tests**: For testing API endpoints and service interactions
- **Mocks**: For isolating tests from external dependencies

## Backend Testing

### Framework Configuration

Backend tests are configured in `/backend/jest.config.js` with additional setup in `/backend/jest.setup.js`. The setup file includes:

- Environment variable configuration for tests
- Global mocks for common dependencies (mongoose, bcrypt, bullmq, etc.)
- Test hooks for consistent test setup and cleanup

### Running Tests

To run backend tests, use:

```bash
cd backend
npm test
```

### Common Mocks

The backend testing framework includes mocks for:

1. **Database (Mongoose)**: Simulates database operations without requiring an actual MongoDB instance
2. **Authentication (bcrypt)**: Provides mock password hashing and validation
3. **Queue System (BullMQ)**: Simulates job queue operations (add, process, etc.)
4. **Logging**: Captures logs for verification without console output

### Best Practices for Backend Tests

1. **Use Proper Isolation**:
   ```javascript
   // Good practice - isolate tests with jest.clearAllMocks()
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

2. **Test Error Handling**:
   ```javascript
   it('should handle errors', async () => {
     const error = new Error('Test error');
     someService.mockRejectedValue(error);
     
     await expectAsync(controller.handleRequest(req, res)).toBeRejected();
     expect(res.status).toHaveBeenCalledWith(500);
   });
   ```

3. **Avoid Out-of-Scope References in Jest Mocks**:
   ```javascript
   // Incorrect - referencing variables outside mock definition
   const handler = () => {};
   jest.mock('./module', () => ({ handler })); // Will fail
   
   // Correct approach
   jest.mock('./module', () => ({
     handler: () => {}
   }));
   ```

## Frontend Testing

### Framework Configuration

Frontend tests are configured in `/frontend/jest.config.js` with additional setup in `/frontend/jest.setup.js`. 

Mock implementations for various React Native components and third-party libraries are located in the `__mocks__` directory.

### Running Tests

To run frontend tests, use:

```bash
cd frontend
npm test
```

### Common Mocks

The frontend testing framework includes mocks for:

1. **React Native Components**: Basic mocks for React Native components
2. **Navigation**: Mocks for React Navigation
3. **State Management (Zustand)**: Mock implementation of Zustand store
4. **Native Modules**: Mocks for various native module integrations

### Best Practices for Frontend Tests

1. **Testing Components**:
   ```javascript
   import { render, fireEvent } from '@testing-library/react-native';
   
   it('should handle user interaction', () => {
     const { getByTestId } = render(<MyComponent />);
     const button = getByTestId('submit-button');
     fireEvent.press(button);
     expect(mockFunction).toHaveBeenCalled();
   });
   ```

2. **Testing Store Integration**:
   ```javascript
   it('should interact with state', () => {
     const { getByText } = render(<ComponentWithStore />);
     expect(getByText('Initial Value')).toBeTruthy();
     
     // Interact and check updated state
     fireEvent.press(getByText('Update'));
     expect(getByText('Updated Value')).toBeTruthy();
   });
   ```

## Recent Fixes and Improvements

### Backend Fixes

1. **BullMQ Mock Issue**: Fixed inconsistencies with how the BullMQ Worker and Queue were mocked, ensuring proper event handler simulation.

2. **Missing Module Dependencies**: Created proper mock for `bcrypt` module to avoid dependency issues in tests.

3. **Worker Test Improvements**: Updated worker tests to focus on verifiable behaviors rather than event handler registrations.

4. **Upload Controller Tests**: Fixed issues with mock references and restructured to ensure proper isolation.

### Frontend Fixes

1. **Zustand Store Mock**: Updated the mock implementation to support both default and named imports:
   ```javascript
   // Now supports all import patterns:
   import create from 'zustand';              // Default import
   import { create } from 'zustand';          // Named import
   import create, { createStore } from 'zustand'; // Mixed import
   ```

## Troubleshooting

### Common Issues and Solutions

1. **"Jest Mock Reference Error"**
   - **Issue**: `ReferenceError: The module factory of jest.mock() is not allowed to reference any out-of-scope variables`
   - **Solution**: Make sure all mock functions are self-contained. Don't reference variables defined outside the mock.

2. **Missing Module Dependencies**
   - **Issue**: `Cannot find module 'module-name'`
   - **Solution**: Either install the module as a dev dependency or create a mock using `jest.mock('module-name', () => ({ ... }))`.

3. **Store/State Issues in Frontend Tests**
   - **Issue**: Components using Zustand stores fail with type errors
   - **Solution**: Ensure the Zustand mock correctly implements the store pattern with proper state management functions.

## Extending Test Coverage

### Areas for Improvement

Current test coverage is:
- Backend: ~22%
- Frontend: ~17%

Priority areas for new tests:
1. Backend API controllers
2. Frontend screens and navigation flow
3. Error handling scenarios
4. Authentication and authorization flows

### Writing New Tests

When adding new tests:
1. Follow existing patterns in similar test files
2. Ensure proper isolation from external dependencies
3. Test both success and error cases
4. Consider edge cases and validation scenarios

## Integration with CI/CD

The test suite is integrated with our CI/CD pipeline. See [CI_INTEGRATION_GUIDE.md](./CI_INTEGRATION_GUIDE.md) for details on how tests are automatically run during the build and deployment process.

## Maintenance

The testing framework should be regularly reviewed and updated as the project evolves. Periodic maintenance tasks include:

1. Updating mocks when dependencies are updated
2. Reviewing test coverage and adding tests for new features
3. Refactoring tests as code evolves
4. Ensuring CI integration remains functional

---

**Last Updated**: April 2024