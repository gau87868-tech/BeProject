# Quick Start Guide - Backend Servers

## Prerequisites
- Node.js v18+ installed
- npm installed
- MongoDB Atlas account (credentials configured in config.env)
- Git (optional, for version control)

---

## Running Both Servers

### Option 1: Run in Separate Terminal Windows (Recommended for Development)

**Terminal 1 - Phase 1 Server (Port 3000):**
```bash
cd e:\Final_YEar_Project\Server
npm install
npm start
```

**Terminal 2 - Phase 2 Server (Port 4000):**
```bash
cd e:\Final_YEar_Project\Company_server
npm install
npm start
```

### Option 2: Run Both at Once (Using npm-run-all)

Install npm-run-all globally:
```bash
npm install -g npm-run-all
```

Then run from the root project directory:
```bash
cd e:\Final_YEar_Project
npm-run-all --parallel start:phase1 start:phase2
```

---

## Server URLs

| Service | URL | Swagger Docs |
|---------|-----|--------------|
| Phase 1 (Student) | http://localhost:3000 | http://localhost:3000/api-docs |
| Phase 2 (Company) | http://localhost:4000 | http://localhost:4000/api-docs |

---

## Health Check

Test if servers are running:

**Phase 1:**
```bash
curl http://localhost:3000/api/v1/health
```

**Phase 2:**
```bash
curl http://localhost:4000/api/v2/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Health check passed"
}
```

---

## Sample API Calls

### Phase 1 - User Signup
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "user"
  }'
```

### Phase 2 - Organization Registration
```bash
curl -X POST http://localhost:4000/api/v2/organization/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Tech Corp",
    "companyEmail": "hr@techcorp.com",
    "password": "OrgPass123!"
  }'
```

---

## Environment Variables

### Phase 1 Server (Server/config.env)
```
PORT = 3000
JWT_SECRET_STRING = aiInterviewerBEcompFInalYearpRoJect
MONGO_CONN_STR = mongodb+srv://krushna24:Krishh_24_@krushna1.f8hvv.mongodb.net/aiInterviewer?retryWrites=true&w=majority&appName=Krushna1
```

### Phase 2 Server (Company_server/config.env)
```
PORT = 4000
MONGODB_URL = mongodb+srv://krushna24:Krishh_24_@krushna1.f8hvv.mongodb.net/aiInterviewer?retryWrites=true&w=majority&appName=Krushna1
JWT_SECRET_STRING = jSonWebTokenAIinterViewerProject
SENDING_EMAIL = krushnadiwate2417@gmail.com
SENDING_EMAIL_PASSWORD = nttt zepz hqye ymnv
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Verify MongoDB Atlas connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Verify credentials are correct

### Module Not Found
```bash
# Reinstall dependencies
rm node_modules package-lock.json
npm install
```

### Clear nodemon Cache
```bash
# If using nodemon, clear its cache
npx nodemon --exec node server.js --ignore "*.json"
```

---

## Development Tips

- **Hot Reload:** nodemon is configured to auto-restart on file changes
- **Swagger Testing:** Use Swagger UI at /api-docs for interactive API testing
- **Database:** Both servers use the same MongoDB instance
- **Logs:** Check console output for detailed debugging information

---

## Production Considerations

Before deploying to production:
1. Change JWT_SECRET_STRING to a strong random value
2. Secure API keys and sensitive data
3. Enable HTTPS/SSL
4. Configure proper CORS settings
5. Set up environment variables in production environment
6. Enable rate limiting
7. Set up monitoring and logging
8. Use PM2 or similar process manager instead of nodemon

---

For detailed API documentation, visit the Swagger UI endpoints above.
