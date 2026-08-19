/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Base API URL - can be configured via environment variables
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// Server URL for file downloads and static assets (without /api)
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    ADMIN_LOGIN: "/admin/login",
    ADMIN_REGISTER: "/admin/register",
    STUDENT_LOGIN: "/student/login",
    STUDENT_REGISTER: "/student/register",
  },

  // Students
  STUDENTS: {
    BASE: "/students",
    CREATE: "/students/create",
    UPDATE: (id: number) => `/students/${id}/update`,
    DELETE: (id: number) => `/students/${id}/delete`,
    GET_BY_ID: (id: number) => `/students/${id}`,
    GET_BY_CLASS: (className: string) => `/students/class/${className}`,
  },

  // Staff
  STAFF: {
    BASE: "/staff",
    CREATE: "/staff/create",
    UPDATE: (id: number) => `/staff/${id}/update`,
    DELETE: (id: number) => `/staff/${id}/delete`,
    GET_BY_ID: (id: number) => `/staff/${id}`,
    GET_BY_DEPARTMENT: (department: string) =>
      `/staff/department/${department}`,
    GET_BY_STATUS: (status: string) => `/staff/status/${status}`,
  },

  // Teachers
  TEACHERS: {
    BASE: "/teachers",
    CREATE: "/teachers/create",
    UPDATE: (id: number) => `/teachers/${id}/update`,
    DELETE: (id: number) => `/teachers/${id}/delete`,
    GET_BY_ID: (id: number) => `/teachers/${id}`,
    GET_BY_DEPARTMENT: (department: string) =>
      `/teachers/department/${department}`,
    GET_BY_STATUS: (status: string) => `/teachers/status/${status}`,
  },

  // Blogs
  BLOGS: {
    BASE: "/blogs",
    CREATE: "/blogs/create",
    UPDATE: (id: number) => `/blogs/${id}/update`,
    DELETE: (id: number) => `/blogs/${id}/delete`,
    GET_BY_ID: (id: number) => `/blogs/${id}`,
  },

  // Programs
  PROGRAMS: {
    BASE: "/programs",
    CREATE: "/programs/create",
    UPDATE: (id: number) => `/programs/${id}/update`,
    DELETE: (id: number) => `/programs/${id}/delete`,
    GET_BY_ID: (id: number) => `/programs/${id}`,
  },

  // Admins
  ADMINS: {
    BASE: "/admins",
    CREATE: "/admins/create",
    UPDATE: (id: number) => `/admins/${id}/update`,
    DELETE: (id: number) => `/admins/${id}/delete`,
    GET_BY_ID: (id: number) => `/admins/${id}`,
  },
  // Academic Years
  ACADEMIC_YEARS: {
    BASE: "/academic-years",
    CREATE: "/academic-years/create",
    UPDATE: (id: number) => `/academic-years/${id}/update`,
    DELETE: (id: number) => `/academic-years/${id}/delete`,
    GET_BY_ID: (id: number) => `/academic-years/${id}`,
  },

  // Classes
  CLASSES: {
    BASE: "/classes",
    CREATE: "/classes",
    UPDATE: (id: number) => `/classes/${id}`,
    DELETE: (id: number) => `/classes/${id}`,
    GET_BY_ID: (id: number) => `/classes/${id}`,
  },

  SUBJECTS: {
    BASE: "/subjects",
    CREATE: "/subjects",
    UPDATE: (id: number) => `/subjects/${id}`,
    DELETE: (id: number) => `/subjects/${id}`,
    GET_BY_ID: (id: number) => `/subjects/${id}`,
  },
  // Announcements
  ANNOUNCEMENTS: {
    BASE: "/announcements",
    CREATE: "/announcements/create",
    UPDATE: (id: number) => `/announcements/${id}/update`,
    DELETE: (id: number) => `/announcements/${id}/delete`,
    GET_BY_ID: (id: number) => `/announcements/${id}`,
  },

  // Attendance
  ATTENDANCE: {
    BASE: "/attendance",
    CREATE: "/attendance/create",
    UPDATE: (id: number) => `/attendance/${id}/update`,
    DELETE: (id: number) => `/attendance/${id}/delete`,
    GET_BY_STUDENT: (studentId: number) => `/attendance/student/${studentId}`,
  },

  // Grades
  GRADES: {
    BASE: "/grades",
    CREATE: "/grades/create",
    UPDATE: (id: number) => `/grades/${id}/update`,
    DELETE: (id: number) => `/grades/${id}/delete`,
    GET_BY_STUDENT: (studentId: number) => `/grades/student/${studentId}`,
  },

  // Fees
  FEES: {
    BASE: "/fees",
    CREATE: "/fees/create",
    UPDATE: (id: number) => `/fees/${id}/update`,
    DELETE: (id: number) => `/fees/${id}/delete`,
    GET_BY_STUDENT: (studentId: number) => `/fees/student/${studentId}`,
  },

  // Leaves
  LEAVES: {
    BASE: "/leaves",
    CREATE: "/leaves/create",
    UPDATE: (id: number) => `/leaves/${id}/update`,
    DELETE: (id: number) => `/leaves/${id}/delete`,
    APPROVE: (id: number) => `/leaves/${id}/approve`,
    REJECT: (id: number) => `/leaves/${id}/reject`,
  },

  // Timetables
  TIMETABLES: {
    BASE: "/timetables",
    CREATE: "/timetables/create",
    UPDATE: (id: number) => `/timetables/${id}/update`,
    DELETE: (id: number) => `/timetables/${id}/delete`,
    GET_BY_CLASS: (className: string) => `/timetables/class/${className}`,
  },

  // Assignments
  ASSIGNMENTS: {
    BASE: "/assignments",
    CREATE: "/assignments/create",
    UPDATE: (id: number) => `/assignments/${id}/update`,
    DELETE: (id: number) => `/assignments/${id}/delete`,
    GET_BY_CLASS: (className: string) => `/assignments/class/${className}`,
  },

  // Content
  CONTENT: {
    BASE: "/content",
    SCHOOL_PROFILE: "/content/school-profile",
    UPDATE: (type: string) => `/content/${type}/update`,
  },

  // Career
  CAREER: {
    // Public endpoints
    POSITIONS: "/career/positions",
    GET_POSITION: (id: number) => `/career/positions/${id}`,
    SUBMIT_APPLICATION: "/career/applications",

    // Admin endpoints
    ADMIN_POSITIONS: "/career/admin/positions",
    CREATE_POSITION: "/career/admin/positions",
    UPDATE_POSITION: (id: number) => `/career/admin/positions/${id}`,
    DELETE_POSITION: (id: number) => `/career/admin/positions/${id}`,

    ADMIN_APPLICATIONS: "/career/admin/applications",
    GET_APPLICATION: (id: number) => `/career/admin/applications/${id}`,
    UPDATE_APPLICATION: (id: number) => `/career/admin/applications/${id}`,
    DELETE_APPLICATION: (id: number) => `/career/admin/applications/${id}`,
  },
};

// Request timeout (30 seconds)
export const REQUEST_TIMEOUT = 30000;

// Token storage keys
export const TOKEN_KEY = "token";
export const SESSION_TOKEN_KEY = "sessionToken";
