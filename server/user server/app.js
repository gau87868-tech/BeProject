const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const interviewRouter = require("./src/Routes/interviewRoutes");
const questionRouter = require('./src/Routes/questionRouter');
const companyRouter = require("./src/Routes/companyRoute");
const answerRouter = require("./src/Routes/answersRoute");
const authRouter = require("./src/Routes/authRoute");
const userRouter = require("./src/Routes/userRoute");
const { validateToken, optionalAuth } = require('./src/middleware/auth');
const { errorHandler } = require('./src/middleware/errorHandler');
const cors = require("cors");


const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"]


const app = express();

app.use(cors({
    origin : function (origin,callback){
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        }else{
            callback(new Error('Not Allowed By Cors'))
        }
    },
    credentials : true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'AI Interviewer Phase 1 API is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", validateToken, userRouter);
app.use("/api/v1/interview", validateToken, interviewRouter);
app.use("/api/v1/questions", optionalAuth, questionRouter);
app.use("/api/v1/company", optionalAuth, companyRouter);
app.use("/api/v1/answers", validateToken, answerRouter);

// Root endpoint
app.use('/', (req, res, next) => {
    res.status(200).json({
        status: "success",
        error: false,
        message: "AI Interviewer Phase 1 API",
        routes: {
            "auth": "/api/v1/auth",
            "users": "/api/v1/users",
            "interviews": "/api/v1/interview",
            "questions": "/api/v1/questions",
            "companies": "/api/v1/company",
            "answers": "/api/v1/answers",
            "documentation": "/api-docs"
        }
    })
    next();
})

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