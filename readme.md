# Dashboard Backend

A Node.js and Express backend for a dashboard application with:

- JWT-based authentication
- User registration and login
- Todo CRUD APIs
- Redis caching for todo reads
- Cloudinary-based avatar upload and delete
- MongoDB with Mongoose
- Vercel deployment support

This README is written from the current codebase so it matches the actual project behavior.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Redis
- JSON Web Token (`jsonwebtoken`)
- Bcrypt (`bcryptjs`)
- Cloudinary
- Vercel

## Project Structure

```text
dashbord-backend/
|-- controllers/
|   |-- todos.controller.js
|   `-- users.contoller.js
|-- middleware/
|   `-- authmiddleware.js
|-- models/
|   |-- Todos.js
|   `-- User.js
|-- routes/
|   |-- todos.routes.js
|   |-- upload.js
|   `-- users.routes.js
|-- utils/
|   |-- cloudinary.js
|   |-- db.js
|   `-- redis.js
|-- package.json
|-- server.js
`-- vercel.json
```

## Features

### Authentication

- Register a new user
- Login with email and password
- Protect routes with JWT
- Accept token from either:
  - `Authorization: Bearer <token>`
  - `x-auth-token: <token>`

### Todos

- Create a todo
- Get the logged-in user's todos
- Update a todo
- Delete a todo
- Cache todo list responses in Redis for 60 seconds

### User Profile and Avatar

- Get authenticated user profile
- Upload/update avatar using Cloudinary
- Delete avatar

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Installation

```bash
npm install
```

## Run Locally

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

By default, the server runs on:

```text
http://localhost:5000
```

## API Base URL

```text
/api
```

Examples:

- `/api/user/register`
- `/api/user/login`
- `/api/todos`
- `/api/upload/avatar`

## API Endpoints

### User Routes

Base path: `/api/user`

#### `POST /register`

Register a new user.

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Success response:

```json
{
  "isSucess": true,
  "message": "User register successfully"
}
```

#### `POST /login`

Login and get a JWT token.

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Success response:

```json
{
  "isSuccess": true,
  "message": "login successful",
  "token": "your_jwt_token",
  "user": {
    "id": "user_id",
    "email": "john@example.com"
  }
}
```

#### `GET /getUser`

Protected route.

Returns user data from the database.

Headers:

```http
Authorization: Bearer your_jwt_token
```

Current implementation note:

- This route currently returns all users from the database.
- Password fields are not removed in this controller response.
- If this is intended for production, it should be restricted or sanitized.

### Todo Routes

Base path: `/api/todos`

All todo routes are protected.

Headers:

```http
Authorization: Bearer your_jwt_token
```

#### `POST /`

Create a todo.

Request body:

```json
{
  "title": "Finish backend README",
  "description": "Write a clean and professional README file"
}
```

#### `GET /`

Get todos created by the logged-in user.

Behavior:

- Checks Redis first
- If cache exists, returns cached todos
- If not, fetches from MongoDB
- Saves result in Redis for 60 seconds

#### `PUT /:id`

Update a todo by ID.

Example request body:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "isCompleted": true
}
```

#### `DELETE /:id`

Delete a todo by ID.

### Upload Routes

Base path: `/api/upload`

All upload routes are protected.

#### `GET /profile`

Get authenticated user profile with avatar fields.

#### `POST /avatar`

Upload or replace the current user's avatar on Cloudinary.

Request body:

```json
{
  "image": "base64_or_image_data_uri"
}
```

Behavior:

- Deletes previous avatar from Cloudinary if one exists
- Uploads the new image
- Stores `avatar` and `avatarPublicId` on the user document

#### `DELETE /avatar`

Delete the current user's avatar.

Behavior:

- Deletes the file from Cloudinary if present
- Clears avatar fields from MongoDB

## Authentication Details

The backend supports two token header formats:

```http
Authorization: Bearer your_jwt_token
```

or

```http
x-auth-token: your_jwt_token
```

JWT payload currently stores:

```json
{
  "id": "user_id"
}
```

Token expiry:

- `7d`

## Data Models

### User

Fields:

- `name`
- `email`
- `password`
- `avatar`
- `avatarPublicId`
- `createdAt`
- `updatedAt`

### Todo

Fields:

- `title`
- `description`
- `isCompleted`
- `createdBy`
- `createdAt`
- `updatedAt`

## Scripts

```bash
npm run dev
npm start
```

## Deployment

This project includes a `vercel.json` file and is configured to deploy `server.js` with `@vercel/node`.

## Important Notes

These points reflect the current codebase:

- CORS is currently open to all origins with `origin: "*"`
- Request body size limit is set to `50mb`
- Redis connects during app startup
- MongoDB connects during app startup
- The project uses ES modules (`"type": "module"`)

## Suggested Improvements

If you want to make this production-ready, these would be strong next steps:

- Add request validation for all routes
- Sanitize user responses to avoid exposing sensitive fields
- Add centralized error handling middleware
- Add rate limiting for auth routes
- Add logging and health-check endpoints
- Add tests for auth, todos, and upload flows
- Restrict CORS to known frontend domains
- Add an `.env.example` file

## Author

Shah Faisal Khalil
