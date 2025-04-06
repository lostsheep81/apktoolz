# APKToolz Backend

## Overview
This is the backend service for the APKToolz project, built with Node.js and Express.

## Prerequisites
- Node.js >= 18.x
- npm >= 8.x

## Local Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```
PORT=3000
MONGODB_URI=<your-mongodb-uri>
REDIS_URI=<your-redis-uri>
JWT_SECRET=<your-jwt-secret>
```

## Scripts
- `npm start`: Start the server.
- `npm test`: Run tests.

## Installation
1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm start
   ```

## API Endpoints
### POST /upload
- **Description**: Upload an APK file for validation.
- **Request**:
  - Header: `Content-Type: multipart/form-data`
  - Body: `apkFile` (file)
- **Response**:
  - Success: `{ success: true, data: { message: 'Validated', filename: '...' } }`
  - Error: `{ success: false, error: { code: '...', message: '...' } }`

## License
MIT License.