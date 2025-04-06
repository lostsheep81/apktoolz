# CI/CD Integration Guide

This document provides step-by-step instructions for integrating the APKToolz testing framework with your CI/CD system. The example below uses GitHub Actions, but the concepts can be adapted to other CI/CD platforms.

---

## Step 1: Set Up the CI/CD Pipeline

### 1.1 Create a Workflow File
- In your repository, create a new directory called `.github/workflows` (if it doesn't already exist).
- Create a new workflow file named `ci-tests.yml` inside that directory.

### 1.2 Define the Workflow Trigger
- Configure the workflow to trigger on `push` and `pull_request` events.
  
```yaml
name: CI Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

---

## Step 2: Define Jobs for Backend and Frontend Tests

### 2.1 Backend Testing Job

- **Checkout Code**: Use the checkout action to pull your repository content.
- **Setup Node.js Environment**: Ensure you’re using the correct Node version (e.g., Node 18).
- **Install Dependencies**: Change directory to `/backend` and run `npm install`.
- **Run Backend Tests**: Execute the backend test script `./run-tests.sh`, which is configured to run Jest in verbose mode.

```yaml
jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: "18"
    
    - name: Install Backend Dependencies
      working-directory: backend
      run: npm install

    - name: Run Backend Tests
      working-directory: backend
      run: ./run-tests.sh
```

### 2.2 Frontend Testing Job

- **Checkout Code**: As before, check out your repository.
- **Setup Node.js Environment**: Use the same Node version.
- **Install Dependencies**: Change directory to `/frontend` and run `npm install`.
- **Run Frontend Tests**: Execute `npm test`, which relies on the `jest.config.js` in the frontend directory.

```yaml
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: "18"
    
    - name: Install Frontend Dependencies
      working-directory: frontend
      run: npm install

    - name: Run Frontend Tests
      working-directory: frontend
      run: npm test
```

### 2.3 Full Workflow Example

Combine both jobs in your `ci-tests.yml` file:

```yaml
name: CI Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      
      - name: Install Backend Dependencies
        working-directory: backend
        run: npm install

      - name: Run Backend Tests
        working-directory: backend
        run: ./run-tests.sh
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      
      - name: Install Frontend Dependencies
        working-directory: frontend
        run: npm install

      - name: Run Frontend Tests
        working-directory: frontend
        run: npm test
```

---

## Step 3: Commit and Verify

1. **Commit Changes**: Add the new workflow file to your repository and commit:
   ```
   git add .github/workflows/ci-tests.yml
   git commit -m "Add CI/CD integration workflow for tests"
   git push
   ```

2. **Verify the Workflow Execution**:  
   - Navigate to the "Actions" tab in your GitHub repository.
   - Ensure that the workflow runs and that both backend and frontend tests execute as expected.
   - Review the logs to verify the test results.

---

## Next Steps

After you have successfully integrated and verified the CI/CD pipeline:
- **Monitor the pipeline** for test failures, coverage trends, and any configuration issues.
- **Iterate and Refine**: Update your testing configurations and documentation (refer to TESTING.md, NEXT_STEPS.md, TROUBLESHOOTING.md, FUTURE_ENHANCEMENTS.md, and WRAP_UP.md) based on the results and feedback from your CI/CD runs.
- **Communicate with the Team**: Share the workflow details and encourage feedback for further improvement.

Happy integrating!