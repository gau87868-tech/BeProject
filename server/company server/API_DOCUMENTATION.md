# AI Interviewer - Phase 2 Backend API

**Phase 2 (Organization/Company)** - Comprehensive backend for company interview management

## Overview

This is the backend server for the AI Interviewer Phase 2, which handles organization authentication, interview creation and management, candidate invitations, question management, and interview result tracking.

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for Authentication
- **Nodemailer** for Email Services
- **Swagger** for API Documentation
- **CORS** for Cross-Origin Support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn
- Gmail account (for email service)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `config.env` file in the root directory:

```env
PORT=4000
NODE_ENV=development

# MongoDB
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/aiinterviewer

# JWT
JWT_SECRET_STRING=your_jwt_secret_key_here

# Email Service
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

Access Swagger UI at: `http://localhost:4000/api-docs`

### Base URL
```
http://localhost:4000/api/v2
```

## API Endpoints

### Authentication & Organization Routes (`/organization`)

#### Register Organization
```
POST /organization/register
Content-Type: application/json

{
  "companyName": "TCS",
  "companyEmail": "hr@tcs.com",
  "password": "password123",
  "confirmPassword": "password123",
  "contactPerson": "John Manager",
  "phoneNumber": "+91-1234567890",
  "industry": "IT",
  "website": "www.tcs.com"
}

Response: { organization, tokens: {accessToken, refreshToken} }
```

#### Login Organization
```
POST /organization/login
Content-Type: application/json

{
  "companyEmail": "hr@tcs.com",
  "password": "password123"
}

Response: { organization, tokens: {accessToken, refreshToken} }
```

#### Refresh Token
```
POST /organization/refresh-token

{
  "companyEmail": "hr@tcs.com",
  "refreshToken": "refresh_token_value"
}

Response: { tokens: {accessToken, refreshToken} }
```

#### Get Organization Profile
```
GET /organization/profile/:organizationId
Headers: Authorization: Bearer {accessToken}

Response: { organization }
```

#### Update Organization Profile
```
PUT /organization/profile/:organizationId
Headers: Authorization: Bearer {accessToken}

{
  "companyName": "TCS Updated",
  "contactPerson": "New Manager",
  "phoneNumber": "+91-9876543210",
  "industry": "IT Services",
  "description": "Leading IT company",
  "website": "www.tcs-new.com"
}

Response: { organization }
```

#### Get Dashboard Statistics
```
GET /organization/dashboard/:organizationId
Headers: Authorization: Bearer {accessToken}

Response: {
  totalInterviews,
  totalCandidates,
  completedInterviews,
  averageScore
}
```

### Interview Routes (`/interview`)

#### Create Interview
```
POST /interview/create
Headers: Authorization: Bearer {accessToken}

{
  "organizationId": "org_id",
  "title": "Senior Developer Interview Round 1",
  "description": "Technical round for senior developer position",
  "role": "Senior Developer",
  "scheduledAt": "2024-04-15T10:00:00Z",
  "accessType": "private",
  "duration": 45
}

Response: { interview }
```

#### Get Organization Interviews
```
GET /interview/list/:organizationId?status=active
Headers: Authorization: Bearer {accessToken}

Query Parameters:
- status: 'active' or 'inactive' (optional)

Response: { interviews, total }
```

#### Get Public Interviews
```
GET /interview/public/list

Response: { interviews, total }
```

#### Get Interview Details
```
GET /interview/:interviewId
Headers: Authorization: Bearer {accessToken}

Response: { interview, questions, results, totalResults }
```

#### Update Interview
```
PUT /interview/:interviewId
Headers: Authorization: Bearer {accessToken}

{
  "title": "Updated Title",
  "description": "Updated Description",
  "role": "Updated Role",
  "scheduledAt": "2024-04-20T10:00:00Z",
  "accessType": "public",
  "duration": 60
}

Response: { interview }
```

#### Invite Candidates
```
POST /interview/:interviewId/invite
Headers: Authorization: Bearer {accessToken}

{
  "emails": ["candidate1@email.com", "candidate2@email.com"],
  "candidateName": "John Doe",
  "companyName": "TCS"
}

Response: {
  inviteSent: [],
  inviteFailed: [],
  totalSent,
  totalFailed
}
```

#### Get Interview Candidates
```
GET /interview/:interviewId/candidates
Headers: Authorization: Bearer {accessToken}

Response: {
  candidates: [
    {
      email,
      status,
      totalScore,
      completedAt,
      ...
    }
  ],
  total
}
```

#### Deactivate Interview
```
PUT /interview/:interviewId/deactivate
Headers: Authorization: Bearer {accessToken}

Response: { interview }
```

#### Delete Interview
```
DELETE /interview/:interviewId
Headers: Authorization: Bearer {accessToken}

Response: { message }
```

### Questions Routes (`/questions`)

#### Add Questions to Interview
```
POST /questions/create
Headers: Authorization: Bearer {accessToken}

{
  "interviewId": "interview_id",
  "organizationId": "org_id",
  "questions": [
    {
      "questionText": "Explain REST API",
      "type": "technical",
      "difficulty": "medium"
    },
    {
      "questionText": "Tell us about your leadership style",
      "type": "behavioral",
      "difficulty": "hard"
    }
  ]
}

Response: { questions }
```

#### Get Interview Questions
```
GET /questions/:interviewId
Headers: Authorization: Bearer {accessToken}

Response: { questions, totalQuestions }
```

#### Update Questions
```
PUT /questions/:interviewId
Headers: Authorization: Bearer {accessToken}

{
  "questions": [...]
}

Response: { questions }
```

#### Delete Questions
```
DELETE /questions/:interviewId
Headers: Authorization: Bearer {accessToken}

Response: { message }
```

#### Get Organization Questions
```
GET /questions/org/:organizationId
Headers: Authorization: Bearer {accessToken}

Response: { questions, total }
```

## Authentication

All private routes require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained from `/organization/login` or `/organization/register`

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

## Interview Workflow

1. **Organization Registration** → Login
2. **Create Interview** → Upload Questions → Invite Candidates
3. **Candidates Take Interview** → Submit Answers
4. **View Results** → Analyze Performance → Provide Feedback

## Email Service

Automated emails are sent for:
- ✅ Interview Invitations
- ✅ Interview Results/Feedback
- ✅ Interview Reminders

Configure Gmail:
1. Enable 2-factor authentication in Gmail
2. Generate App Password
3. Use App Password in `config.env`

## Database Schema

### Organization Model
- `_id`: ObjectId
- `companyName`: String
- `companyEmail`: String (unique)
- `password`: String (hashed)
- `contactPerson`: String
- `phoneNumber`: String
- `industry`: String
- `description`: String
- `website`: String
- `createdAt`: Date

### Interview Model
- `_id`: ObjectId
- `organizationId`: ObjectId (ref: Organization)
- `title`: String
- `description`: String
- `role`: String
- `scheduledAt`: Date
- `accessType`: String (public/private)
- `duration`: Number
- `invitedStudents`: Array
- `isActive`: Boolean
- `createdAt`: Date

### Question Model
- `_id`: ObjectId
- `interviewId`: ObjectId (ref: Interview)
- `organizationId`: ObjectId (ref: Organization)
- `questions`: Array of questions with text, type, difficulty
- `createdAt`: Date

### Result Model
- `_id`: ObjectId
- `interviewId`: ObjectId
- `organizationId`: ObjectId
- `candidateEmail`: String
- `candidateName`: String
- `answers`: Array of question-answer pairs with scores
- `totalScore`: Number
- `averageScore`: Number
- `status`: String (pending/in_progress/completed)
- `completedAt`: Date
- `overallFeedback`: String

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=4000
MONGODB_URL=<production_mongodb_url>
JWT_SECRET_STRING=<strong_secret_key>
FRONTEND_URL=<production_frontend_url>
SENDING_EMAIL=<sender_email>
SENDING_EMAIL_PASSWORD=<app_password>
```

## Security Best Practices

✅ Passwords hashed with bcryptjs
✅ JWT-based authentication
✅ CORS enabled
✅ Input validation
✅ Error handling middleware
✅ Environment variables for secrets
✅ Email verification tokens

## Future Enhancements

- [ ] AI-powered answer evaluation
- [ ] Detailed analytics dashboard
- [ ] Bulk candidate import
- [ ] Interview templates
- [ ] Custom branding
- [ ] Video recording storage
- [ ] Advanced reporting
- [ ] Team management
- [ ] API rate limiting

## Support

For issues or questions, please contact: support@aiinterviewer.com

## License

ISC
