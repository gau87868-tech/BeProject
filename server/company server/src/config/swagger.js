/**
 * @description Swagger Configuration for Phase 2 (Organization/Company) Backend
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AI Interviewer - Phase 2 (Organization) API',
            version: '1.0.0',
            description: 'Comprehensive API documentation for AI Interviewer Phase 2 Backend',
            contact: {
                name: 'AI Interviewer Team',
                email: 'support@aiinterviewer.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server'
            },
            {
                url: 'https://api-org.aiinterviewer.com',
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
                Organization: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        companyName: { type: 'string' },
                        companyEmail: { type: 'string' },
                        contactPerson: { type: 'string' },
                        phoneNumber: { type: 'string' },
                        industry: { type: 'string' },
                        description: { type: 'string' },
                        website: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Interview: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        organizationId: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        role: { type: 'string' },
                        scheduledAt: { type: 'string', format: 'date-time' },
                        accessType: { type: 'string', enum: ['public', 'private'] },
                        duration: { type: 'number' },
                        invitedStudents: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    inviteToken: { type: 'string' },
                                    invitedOn: { type: 'string', format: 'date-time' },
                                    status: { type: 'string', enum: ['pending', 'started', 'completed'] },
                                    completedAt: { type: 'string', format: 'date-time' }
                                }
                            }
                        },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Question: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        interviewId: { type: 'string' },
                        organizationId: { type: 'string' },
                        questions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string' },
                                    questionText: { type: 'string' },
                                    type: { type: 'string', enum: ['technical', 'behavioral', 'coding', 'hr'] },
                                    difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] }
                                }
                            }
                        },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                InterviewResult: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        interviewId: { type: 'string' },
                        organizationId: { type: 'string' },
                        candidateEmail: { type: 'string' },
                        candidateName: { type: 'string' },
                        totalScore: { type: 'number', min: 0, max: 100 },
                        averageScore: { type: 'number', min: 0, max: 100 },
                        status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
                        completedAt: { type: 'string', format: 'date-time' },
                        overallFeedback: { type: 'string' }
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
                                organization: { $ref: '#/components/schemas/Organization' },
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
        './src/routes/organizationRouter.js',
        './src/routes/interviewRoute.js',
        './src/routes/questionRoute.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
