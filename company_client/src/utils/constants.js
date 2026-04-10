// src/utils/constants.js
const BASE_URL = "http://localhost:4000";

// Organization Auth
export const COMPANY_REGISTER_URL = `${BASE_URL}/api/v2/organization/register`;
export const COMPANY_LOGIN_URL = `${BASE_URL}/api/v2/organization/login`;
export const COMPANY_REFRESH_TOKEN_URL = `${BASE_URL}/api/v2/organization/refresh-token`;
export const COMPANY_DASHBOARD_URL = `${BASE_URL}/api/v2/organization/dashboard/overview`;

// Interview Management
export const CREATE_INTERVIEW_URL = `${BASE_URL}/api/v2/interview/create`;
export const INVITE_STUDENTS_URL = `${BASE_URL}/api/v2/interview`; // append /:id/invite
export const SUBMIT_INTERVIEW_URL = `${BASE_URL}/api/v2/interview/submit`;
export const INTERVIEW_RESULTS_URL = `${BASE_URL}/api/v2/interview/results`; // append /:interviewId
export const INTERVIEW_RESULT_URL = `${BASE_URL}/api/v2/interview/result`; // append /:resultId

// Question Management
export const CREATE_QUESTIONS_URL = `${BASE_URL}/api/v2/questions/create`;
export const QUESTIONS_URL = `${BASE_URL}/api/v2/questions`; // append /:interviewId
export const ORG_QUESTIONS_URL = `${BASE_URL}/api/v2/questions/org`; // append /:organizationId
