/**
 * API Response Types
 * Type definitions for API requests and responses
 */

// Common types
export type Gender = "Male" | "Female" | "Other";

// Base API Response
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Pagination
export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Authentication
export interface LoginResponse {
  message: string;
  token: string;
  data: {
    id: number;
    email: string;
    fullName: string;
    role?: string;
    phone?: string;
    profileImage?: string;
    status?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Student
export interface Student {
  id: number;
  fullName: string;
  email: string;
  contactNumber: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  currentClass?: string;
  section?: string;
  rollNumber?: string;
  admissionDate?: string;
  guardianName?: string;
  guardianPhone?: string;
  bloodGroup?: string;
  status: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentFormData extends Omit<
  Student,
  "id" | "createdAt" | "updatedAt"
> {}

// Staff
export interface Staff {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  position: string;
  department: string;
  employeeId?: string;
  joiningDate?: string;
  qualification?: string;
  experience?: string;
  salary?: string;
  bloodGroup?: string;
  status: string;
  profileImage?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  subjects?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffFormData extends Omit<
  Staff,
  "id" | "createdAt" | "updatedAt"
> {}

// Teacher
export interface Teacher {
  id: number;
  // Basic Information
  firstName: string;
  middleName?: string;
  lastName: string;
  nin?: string;
  dateOfBirth?: string;
  gender?: Gender;
  citizenship?: string;

  // Permanent Address
  permanentProvince?: string;
  permanentDistrict?: string;
  permanentMunicipality?: string;
  permanentWard?: string;

  // Temporary Address
  temporaryProvince?: string;
  temporaryDistrict?: string;
  temporaryMunicipality?: string;
  temporaryWard?: string;

  // Family Information
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  willPerson?: string;

  // Additional Information
  caste?: string;
  motherTongue?: string;
  disability?: string;
  mobile: string;
  email: string;
  pan?: string;
  bankName?: string;
  bankAccount?: string;

  // Professional Information
  employeeId?: string;
  department: string;
  subjects?: string;
  teachingLicense?: string;
  joiningDate?: string;
  qualification?: string;
  experience?: string;
  bloodGroup?: string;

  // Government Schemes
  karmachariSanachayakosh?: string;
  sabadhikBimaKosh?: string;
  ssf?: string;
  nagarikLaganiKosh?: string;

  // Status and Image
  status: string;
  profileImage?: string;
  notes?: string;
  position?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherFormData extends Omit<
  Teacher,
  "id" | "createdAt" | "updatedAt"
> {}

// Blog
export interface Blog {
  id: number;
  blogTitle: string;
  blogDescription: string;
  blogAuthor?: string;
  authorId?: number;
  blogCategory?: string;
  blogImage?: string;
  blogStatus: string;
  audience?: string;
  tags?: string;
  views?: number;
  publishedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogFormData extends Omit<
  Blog,
  "id" | "createdAt" | "updatedAt"
> {}

// Program
export interface Program {
  id: number;
  title: string;
  description: string;
  duration?: string;
  eligibility?: string;
  fees?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Admin
export interface Admin {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Announcement
export interface Announcement {
  id: number;
  title: string;
  content: string;
  targetAudience?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  isPinned?: boolean;
  startDate?: string;
  endDate?: string;
  attachments?: Array<{
    filename: string;
    originalName: string;
    fileType: string;
    url: string;
    size: number;
  }>;
  status: "active" | "expired" | "draft";
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Attendance
export interface Attendance {
  id: number;
  studentId: number;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Grade
export interface Grade {
  id: number;
  studentId: number;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
  grade?: string;
  remarks?: string;
  examDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fee
export interface Fee {
  id: number;
  studentId: number;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  status: "paid" | "pending" | "overdue";
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Leave
export interface Leave {
  id: number;
  applicantType: "student" | "staff";
  applicantId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: number;
  approvalDate?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Timetable
export interface Timetable {
  id: number;
  class: string;
  section?: string;
  day: string;
  period: number;
  subject: string;
  teacherId?: number;
  startTime: string;
  endTime: string;
  room?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Assignment
export interface Assignment {
  id: number;
  title: string;
  description: string;
  class: string;
  section?: string;
  subject: string;
  teacherId?: number;
  dueDate: string;
  totalMarks?: number;
  attachments?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Content
export interface Content {
  id: number;
  type: string;
  title: string;
  content: string;
  metadata?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Error Response
export interface ApiError {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Upload Response
export interface UploadResponse {
  message: string;
  url: string;
  path: string;
}

// School Profile
export interface SchoolProfile {
  id?: number;
  iemisCode?: string;
  schoolName?: string;
  schoolNameNepali?: string;
  schoolTypeNepali?: string;
  phone?: string;
  email?: string;
  address?: string;
  addressNepali?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  introduction?: string;
  aboutUsStory?: string;
  aboutUsDescription?: string;
  heroImage?: string;
  mapUrl?: string;
  established?: string;
  principalName?: string;
  principalMessage?: string;
  vision?: string;
  mission?: string;
  website?: string;
  facebookUrl?: string;
  logoUrl?: string;
  schoolCode?: string;
  panNumber?: string;
  registrationNumber?: string;
  affiliation?: string;
  taxPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolProfileFormData extends Omit<
  SchoolProfile,
  "id" | "createdAt" | "updatedAt"
> {}

// School Message (Principal message, etc.)
export interface SchoolMessage {
  id: number;
  personName: string;
  personPosition: string;
  message: string;
  photo?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolMessageFormData extends Omit<
  SchoolMessage,
  "id" | "createdAt" | "updatedAt"
> {}

// Contact Form
export interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  isStudent: boolean;
  className?: string;
  status: "pending" | "contacted" | "resolved";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  isStudent: boolean;
  className?: string;
}

// Career Position
export interface CareerPosition {
  id: number;
  title: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract" | "Temporary";
  location: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salaryRange?: string;
  vacancies: number;
  applicationDeadline?: string;
  noticeFileName?: string;
  noticeFileUrl?: string;
  status: "active" | "closed" | "draft";
  postedDate: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerPositionFormData {
  title: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract" | "Temporary";
  location: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salaryRange?: string;
  vacancies?: number;
  applicationDeadline?: string;
  status?: "active" | "closed" | "draft";
  postedDate?: string;
  noticeFile?: File;
}

// Job Application
export interface JobApplication {
  id: number;
  positionId: number;
  positionTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeFileName: string;
  resumeFileUrl: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "accepted";
  notes?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobApplicationFormData {
  positionId: number;
  applicantName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resume: File;
}
