// src/utils/constants.js
const BASE_URL = "http://localhost:4000";

// Organization Auth
export const COMPANY_REGISTER_URL = `${BASE_URL}/api/v2/organization/register`;
export const COMPANY_LOGIN_URL = `${BASE_URL}/api/v2/organization/login`;
export const COMPANY_REFRESH_TOKEN_URL = `${BASE_URL}/api/v2/organization/refresh-token`;
export const COMPANY_DASHBOARD_URL = `${BASE_URL}/api/v2/organization/dashboard/overview`;
export const COMPANY_PROFILE_URL = `${BASE_URL}/api/v2/organization/profile`; // NEW
export const COMPANY_PASSWORD_URL = `${BASE_URL}/api/v2/organization/password`; // NEW

// Interview Management
export const CREATE_INTERVIEW_URL = `${BASE_URL}/api/v2/interview/create`;
export const INTERVIEW_LIST_URL = `${BASE_URL}/api/v2/interview/list`; // NEW
export const INTERVIEW_DETAIL_URL = `${BASE_URL}/api/v2/interview/detail`; // NEW — append /:id
export const INTERVIEW_UPDATE_URL = `${BASE_URL}/api/v2/interview/update`; // NEW — append /:id
export const INTERVIEW_DELETE_URL = `${BASE_URL}/api/v2/interview/delete`; // NEW — append /:id
export const INTERVIEW_STATUS_URL = `${BASE_URL}/api/v2/interview/status`; // NEW — append /:id
export const INVITE_STUDENTS_URL = `${BASE_URL}/api/v2/interview`; // append /:id/invite
export const SUBMIT_INTERVIEW_URL = `${BASE_URL}/api/v2/interview/submit`;
export const INTERVIEW_RESULTS_URL = `${BASE_URL}/api/v2/interview/results`; // append /:interviewId
export const INTERVIEW_RESULT_URL = `${BASE_URL}/api/v2/interview/result`; // append /:resultId
export const INTERVIEW_SHORTLIST_URL = `${BASE_URL}/api/v2/interview/shortlist`; // NEW — append /:resultId
export const INTERVIEW_ANALYTICS_URL = `${BASE_URL}/api/v2/interview/analytics`; // NEW — append /:interviewId

// Question Management
export const CREATE_QUESTIONS_URL = `${BASE_URL}/api/v2/questions/create`;
export const QUESTIONS_URL = `${BASE_URL}/api/v2/questions`; // append /:interviewId
export const ORG_QUESTIONS_URL = `${BASE_URL}/api/v2/questions/org`; // append /:organizationId
