# AI Interviewer Backend - Complete Setup Guide

Comprehensive setup instructions for both Phase 1 and Phase 2 backends.

## Project Structure

```
Final_YEar_Project/
├── Server/                          # Phase 1 - Student/Candidate Backend
│   ├── src/
│   │   ├── Controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── interviewController.js
│   │   │   └── questionsController.js
│   │   ├── Model/
│   │   │   ├── userModel.js
│   │   │   ├── interviewModel.js
│   │   │   ├── questionsModel.js
│   │   │   └── companyModel.js
│   │   ├── Routes/
│   │   │   ├── authRoute.js
│   │   │   ├── userRoute.js
│   │   │   ├── interviewRoutes.js
│   │   │   ├── questionRouter.js
│   │   │   ├── companyRoute.js
│   │   │   └── answersRoute.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── utils/
│   │   │   ├── tokenUtils.js
│   │   │   └── responseUtil.js
│   │   ├── config/
│   │   │   └── swagger.js
│   │   └── DummyData/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── config.env
│   ├── config.env.example
│   └── API_DOCUMENTATION.md
│
└── Company_server/                  # Phase 2 - Organization/Company Backend
    ├── src/
    │   ├── controllers/
    │   │   ├── organizationController.js
    │   │   ├── interviewController.js
    │   │   └── questionController.js
    │   ├── models/
    │   │   ├── organizationModel.js
    │   │   ├── interviewModel.js
    │   │   ├── questionModel.js
    │   │   └── resultsModel.js
    │   ├── routes/
    │   │   ├── organizationRouter.js
    │   │   ├── interviewRoute.js
    │   │   └── questionRoute.js
    │   ├── middleware/
    │   │   ├── auth.js
    │   │   ├── errorHandler.js
    │   │   └── validation.js
    │   ├── utils/
    │   │   ├── tokenUtils.js
    │   │   ├── responseUtil.js
    │   │   ├── emailService.js
    │   │   └── mailer.js
    │   ├── config/
    │   │   └── swagger.js
    │   └── DummyData/
    ├── app.js
    ├── server.js
    ├── package.json
    ├── config.env
    ├── config.env.example
    └── API_DOCUMENTATION.md
```

## Prerequisites

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas account
- **Git**: For version control
- **Postman/Insomnia**: For API testing (optional)
- **Code Editor**: VS Code (recommended)

## Phase 1 Backend Setup (Server)

### Step 1: Navigate to Server Directory
```bash
cd e:\Final_YEar_Project\Server
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- cors (cross-origin support)
- dotenv (environment variables)
- swagger-jsdoc & swagger-ui-express (API documentation)
- nodemailer (email service)

### Step 3: Configure Environment Variables
```bash
# Copy example to actual config file
copy config.env.example config.env

# Edit config.env with your values
notepad config.env
```

**Required Environment Variables:**
```env
PORT=3000
NODE_ENV=development
MONGO_CONN_STR=mongodb+srv://username:password@cluster.mongodb.net/aiinterviewer
JWT_SECRET_STRING=your_random_secret_key_here
FRONTEND_URL=http://localhost:5173
```

### Step 4: MongoDB Setup

**Option A: Local MongoDB**
- Download from mongodb.com
- Start MongoDB service
- Connection string: `mongodb://localhost:27017/aiinterviewer`

**Option B: MongoDB Atlas (Cloud)**
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Replace username and password in config.env

### Step 5: Start Development Server
```bash
npm start
```

Expected output:
```
Server started on port: 3000
DB Connection Successful
```

### Step 6: Verify API is Running
Open browser and visit:
```
http://localhost:3000/health
http://localhost:3000/api-docs
```

You should see:
- Health check response indicating server is running
- Swagger UI with complete API documentation

### Step 7: Test Authentication
Using Postman/Curl:

**Register:**
```
POST http://localhost:3000/api/v1/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Login:**
```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

## Phase 2 Backend Setup (Company_server)

### Step 1: Navigate to Company_server Directory
```bash
cd e:\Final_YEar_Project\Company_server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
```bash
# Copy example to actual config file
copy config.env.example config.env

# Edit config.env with your values
notepad config.env
```

**Required Environment Variables:**
```env
PORT=4000
NODE_ENV=development
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/aiinterviewer_company
JWT_SECRET_STRING=your_random_secret_key_here
SENDING_EMAIL=your_email@gmail.com
SENDING_EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Step 4: Gmail Setup (for Email Service)

1. Enable 2-Factor Authentication:
   - Go to myaccount.google.com
   - Security section
   - Enable 2FA

2. Create App Password:
   - In Security, select "App passwords"
   - Select Mail and Windows Computer
   - Generate 16-character password
   - Use this in `SENDING_EMAIL_PASSWORD`

### Step 5: MongoDB Setup (Same as Phase 1)
- Use separate database: `aiinterviewer_company`
- OR use same database with different collections

### Step 6: Start Development Server
```bash
npm start
```

Expected output:
```
Server Listening on Port : 4000
Connection Established
```

### Step 7: Verify API is Running
```
http://localhost:4000/health
http://localhost:4000/api-docs
```

### Step 8: Test Authentication
```
POST http://localhost:4000/api/v2/organization/register
Content-Type: application/json

{
  "companyName": "Test Company",
  "companyEmail": "company@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "contactPerson": "John Manager",
  "phoneNumber": "+91-1234567890",
  "industry": "IT"
}
```

## Running Both Servers Simultaneously

### Using Multiple Terminals:

Terminal 1 - Start Phase 1 Server:
```bash
cd e:\Final_YEar_Project\Server
npm start
# Runs on http://localhost:3000
```

Terminal 2 - Start Phase 2 Server:
```bash
cd e:\Final_YEar_Project\Company_server
npm start
# Runs on http://localhost:4000
```

### Using npm-run-all (Optional):
In parent directory:
```bash
npm install -g npm-run-all

npm-run-all --parallel "npm run server1" "npm run server2"
```

## Database Models Overview

### Phase 1 (Student) Models
- **User**: Students/Candidates
  - Fields: _id, name, email, password(hashed), credits, createdAt

- **Interview**: Interview records
  - Fields: candidate(ref), interviews(array), createdAt

- **Question**: Question sets by role
  - Fields: slug(unique), questions(array), timestamps

- **Company**: Company reference data
  - Fields: companyName, role, slug, description

### Phase 2 (Organization) Models
- **Organization**: Companies
  - Fields: companyName, companyEmail(unique), password(hashed), contactPerson, phoneNumber, industry, website, timestamps

- **Interview**: Interview sessions
  - Fields: organizationId, title, description, role, scheduledAt, accessType, duration, invitedStudents(array), isActive

- **Question**: Interview questions
  - Fields: interviewId, organizationId, questions(array with type/difficulty), timestamps

- **Result**: Interview results
  - Fields: interviewId, organizationId, candidateEmail, answers, totalScore, averageScore, status, overallFeedback, timestamps

## API Endpoints Quick Reference

### Phase 1 Endpoints
```
POST   /api/v1/auth/signup           - Register user
POST   /api/v1/auth/login            - Login user
GET    /api/v1/users/profile/:id     - Get profile
PUT    /api/v1/users/profile/:id     - Update profile
POST   /api/v1/interview/submit      - Submit interview
GET    /api/v1/interview/history/:id - Get history
GET    /api/v1/questions/all         - Get all questions
GET    /api/v1/questions/:slug       - Get by role
```

### Phase 2 Endpoints
```
POST   /api/v2/organization/register   - Register org
POST   /api/v2/organization/login      - Login org
GET    /api/v2/interview/list/:id      - Get interviews
POST   /api/v2/interview/create        - Create interview
POST   /api/v2/interview/:id/invite    - Invite candidates
GET    /api/v2/questions/:id           - Get questions
POST   /api/v2/questions/create        - Add questions
```

## Testing the Complete Workflow

### Workflow 1: Student Interview
1. Register student → /api/v1/auth/signup
2. Login → /api/v1/auth/login
3. Get questions → /api/v1/questions/:slug
4. Submit answers → /api/v1/interview/submit
5. View history → /api/v1/interview/history/:userId

### Workflow 2: Organization Interview Management
1. Register organization → /api/v2/organization/register
2. Login → /api/v2/organization/login
3. Create interview → /api/v2/interview/create
4. Add questions → /api/v2/questions/create
5. Invite candidates → /api/v2/interview/:id/invite
6. View results → /api/v2/interview/:id

## Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
npm install
# or
npm install --save express mongoose bcryptjs jsonwebtoken cors dotenv
```

### Issue: "MongoDB Connection Failed"
**Solution:**
- Check MongoDB is running
- Verify MONGO_CONN_STR in config.env
- Check username/password for Atlas
- Ensure IP is whitelisted in Atlas

### Issue: "JWT is not defined"
**Solution:**
```bash
npm install jsonwebtoken
```

### Issue: "Email not sending"
**Solution:**
- Enable 2FA on Gmail
- Create App Password (not regular password)
- Use App Password in config.env
- Check SENDING_EMAIL is correct

### Issue: "CORS Error"
**Solution:**
- Ensure FRONTEND_URL in config.env is correct
- Check app.js has CORS configured
- Verify frontend port matches allowedOrigins

## Development Best Practices

### Code Quality
```bash
# Install ESLint (optional)
npm install --save-dev eslint

# Initialize ESLint
npx eslint --init
```

### Logging
```javascript
// Use appropriate log levels
console.error('Error:', error);
console.warn('Warning:', message);
console.log('Info:', message);
```

### Error Handling
- All routes should handle errors
- Use asyncHandler for try-catch
- Return proper status codes
- Send meaningful error messages

### Input Validation
- Validate all input data
- Use validation middleware
- Check required fields
- Sanitize email addresses

## Deployment Guide

### Prepare for Production
1. Set NODE_ENV=production in config.env
2. Use strong JWT_SECRET_STRING
3. Set proper MongoDB URL
4. Configure email credentials
5. Update FRONTEND_URL to production

### Deploy to Cloud (Heroku, Railway, Render, etc.)

**Example with Heroku:**
```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET_STRING=your_secret
heroku config:set MONGO_CONN_STR=your_mongodb_url

# Deploy
git push heroku main
```

## Additional Resources

- **Express.js Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **JWT Docs**: https://jwt.io
- **Swagger/OpenAPI**: https://swagger.io
- **Nodemailer Docs**: https://nodemailer.com

## Support & Communication

For issues or questions:
1. Check error messages in console
2. Review API_DOCUMENTATION.md
3. Check Swagger UI at /api-docs
4. Contact: support@aiinterviewer.com

## Next Steps

1. ✅ Both backends are now operational
2. ✅ All APIs are documented with Swagger
3. Next: Connect frontend client application
4. Next: Integrate AI evaluation system
5. Next: Deploy to production

---

**Happy Coding!** 🚀
