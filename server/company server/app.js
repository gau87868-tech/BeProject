const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const cors = require('cors');
const app = express();
const orgRouter = require("./src/routes/organizationRouter");
const questionRouter = require("./src/routes/questionRoute");
const interviewRouter = require("./src/routes/interviewRoute");
const { validateOrgToken } = require('./src/middleware/auth');
const { errorHandler } = require('./src/middleware/errorHandler');

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'AI Interviewer Phase 2 API is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use("/api/v2/organization", orgRouter);
app.use("/api/v2/interview", interviewRouter);
app.use("/api/v2/questions", validateOrgToken, questionRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'AI Interviewer Phase 2 (Organization) API',
        routes: {
            "organization": "/api/v2/organization",
            "interviews": "/api/v2/interview",
            "questions": "/api/v2/questions",
            "documentation": "/api-docs"
        }
    });
});

// 404 handling
app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route not found'
    });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;

