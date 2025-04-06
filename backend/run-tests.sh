#!/bin/bash

# Run tests with detailed output
echo "Running tests..."
npx jest --verbose

# Check if tests passed
if [ $? -eq 0 ]; then
  echo "All tests passed!"
  exit 0
else
  echo "Some tests failed. See above for details."
  exit 1
fi