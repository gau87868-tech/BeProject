# AI Interviewer - Phase 1 Backend API

**Phase 1 (Student/Candidate)** - Comprehensive backend for candidate interview management

## Overview

This is the backend server for the AI Interviewer Phase 1, which handles student/candidate authentication, interview submissions, question management, and credit system.

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for Authentication
- **Swagger** for API Documentation
- **CORS** for Cross-Origin Support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `config.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_CONN_STR=mongodb+srv://username:password@cluster.mongodb.net/aiinterviewer

# JWT
JWT_SECRET_STRING=your_jwt_secret_key_here

# Email (Optional - for future enhancements)
SENDING_EMAIL=your_email@gmail.com
SENDING_EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Server

**Development:**
```bash
npm start
```

**Production:**
```bash
NODE_ENV=production npm start
```

## API Documentation

Access Swagger UI at: `http://localhost:3000/api-docs`

### Base URL
```
http://localhost:3000/api/v1
```

## API Endpoints

### 1. Authentication Routes (`/auth`)

#### Register User
```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response: { user, tokens: {accessToken, refreshToken} }
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { user, tokens: {accessToken, refreshToken} }
```

#### Refresh Token
```
POST /auth/refreshToken
Content-Type: application/json

{
  "email": "john@example.com",
  "refreshToken": "refresh_token_value"
}

Response: { tokens: {accessToken, refreshToken} }
```

### 2. User Routes (`/users`) - Private

#### Get User Profile
```
GET /users/profile/:userId
Headers: Authorization: Bearer {accessToken}

Response: { user }
```

#### Update User Profile
```
PUT /users/profile/:userId
Headers: Authorization: Bearer {accessToken}

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}

Response: { user }
```

#### Get User Credits
```
GET /users/credits/:userId
Headers: Authorization: Bearer {accessToken}

Response: { credits, email, name }
```

#### Buy Credits
```
POST /users/buy-credits/:userId
Headers: Authorization: Bearer {accessToken}

{
  "amount": 10
}

Response: { credits, email, name }
```

#### Get All Users (Admin)
```
GET /users/all
Headers: Authorization: Bearer {accessToken}

Response: { users, total }
```

#### Delete User
```
DELETE /users/:userId
Headers: Authorization: Bearer {accessToken}

Response: { message }
```

### 3. Interview Routes (`/interview`) - Private

#### Submit Interview
```
POST /interview/submit
Headers: Authorization: Bearer {accessToken}

{
  "candidate": "user_id",
  "interviews": [
    {
      "companyName": "TCS",
      "companyRole": "Software Engineer",
      "candidateAnswers": [
        {
          "question": "What is your strength?",
          "answer": "My strength is problem solving"
        }
      ]
    }
  ]
}

Response: { interview, credits }
```

#### Get Interview History
```
GET /interview/history/:userId
Headers: Authorization: Bearer {accessToken}

Response: { interviewHistory, totalInterviews }
```

#### Get All Interviews (Admin)
```
GET /interview/all
Headers: Authorization: Bearer {accessToken}

Response: { interviews, total }
```

#### Get Interview by ID
```
GET /interview/:interviewId
Headers: Authorization: Bearer {accessToken}

Response: { interview }
```

#### Delete Interview
```
DELETE /interview/:interviewId
Headers: Authorization: Bearer {accessToken}

Response: { message }
```

### 4. Questions Routes (`/questions`) - Public/Private

#### Get All Questions
```
GET /questions/all

Response: { questions }
```

#### Get Questions by Role
```
GET /questions/:slug

Response: { numberOfQuestions, questionsSet }
```

#### Add Questions (Admin)
```
POST /questions/add
Headers: Authorization: Bearer {accessToken}

{
  "slug": "fullstack-developer",
  "questions": [
    {
      "questionId": "q1",
      "question": "What is React?"
    }
  ]
}

Response: { questionsSet }
```

#### Update Questions (Admin)
```
PUT /questions/:slug
Headers: Authorization: Bearer {accessToken}

{
  "questions": [...]
}

Response: { questionsSet }
```

#### Delete Questions (Admin)
```
DELETE /questions/:slug
Headers: Authorization: Bearer {accessToken}

Response: { message }
```

## Authentication

All private routes require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained from `/auth/login` or `/auth/signup`

## Error Handling

Standard error response format:

```json
{
  "status": "fail",
  "message": "Error description",
  "errors": [] // Optional
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Credit System

- New users start with **15 credits**
- Each interview submission costs **5 credits**
- Credits can be purchased via `/users/buy-credits/:userId`

## Database Schema

### User Model
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (hashed)
- `credits`: Number (default: 15)
- `createdAt`: Date

### Interview Model
- `_id`: ObjectId
- `candidate`: ObjectId (ref: User)
- `interviews`: Array of interview records
- `createdAt`: Date

### Question/Company Model
- Used for mapping questions to company roles

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGO_CONN_STR=<production_mongodb_url>
JWT_SECRET_STRING=<strong_secret_key>
FRONTEND_URL=<production_frontend_url>
```

### Docker Support (Optional)
Create a Dockerfile for containerization.

## Security Best Practices

✅ Passwords hashed with bcryptjs
✅ JWT-based authentication
✅ CORS enabled
✅ Input validation
✅ Error handling middleware
✅ Environment variables for secrets

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Role-based access control (RBAC)
- [ ] Rate limiting
- [ ] API rate throttling
- [ ] Payment integration
- [ ] Advanced security (2FA, OAuth)

## Support

For issues or questions, please contact: support@aiinterviewer.com

## License

ISC
