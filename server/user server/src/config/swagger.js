/**
 * @description Swagger Configuration for Phase 1 (Student/Candidate) Backend
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AI Interviewer - Phase 1 (Student/Candidate) API',
            version: '1.0.0',
            description: 'Comprehensive API documentation for AI Interviewer Phase 1 Backend',
            contact: {
                name: 'AI Interviewer Team',
                email: 'support@aiinterviewer.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            },
            {
                url: 'https://api.aiinterviewer.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Bearer token for API authentication'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        credits: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Interview: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        candidate: { type: 'string' },
                        interviews: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    companyName: { type: 'string' },
                                    companyRole: { type: 'string' },
                                    score: { type: 'number' },
                                    candidateAnswers: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                question: { type: 'string' },
                                                answer: { type: 'string' }
                                            }
                                        }
                                    },
                                    completedAt: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                Company: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        companyName: { type: 'string' },
                        role: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Question: {
                    type: 'object',
                    properties: {
                        slug: { type: 'string' },
                        questions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    questionId: { type: 'string' },
                                    question: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                user: { $ref: '#/components/schemas/User' },
                                tokens: {
                                    type: 'object',
                                    properties: {
                                        accessToken: { type: 'string' },
                                        refreshToken: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        message: { type: 'string' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        './src/Routes/authRoute.js',
        './src/Routes/interviewRoutes.js',
        './src/Routes/questionRouter.js',
        './src/Routes/companyRoute.js',
        './src/Routes/answersRoute.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
