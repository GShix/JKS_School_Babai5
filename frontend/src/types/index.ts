export interface ClassItem {
  id: number;
  name: string;
  medium?: string;
  section?: string;
  department?: string;
  status: string;
  totalStudents?: number;
}
export interface Student {
  id: number;

  // Basic Information
  iemisCode: string;
  studentId: string;
  currentSchool: string;

  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;

  email: string;
  password?: string;
  contactNumber: string;
  dob: string;
  dobNepali?: string;
  gender: string;
  isForeignStudent: boolean;

  // Permanent Address
  permanentAddress: string;
  permanentProvince: string;
  permanentDistrict: string;
  permanentMunicipality: string;
  permanentWard: string;
  permanentTole: string;

  // Temporary / Current Address
  temporaryAddress: string;
  temporaryProvince: string;
  temporaryDistrict: string;
  temporaryMunicipality: string;
  temporaryWard: string;
  temporaryTole: string;
  sameAsPermAddress: boolean;

  // Legacy Address
  address?: string;

  // Family Information
  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianPhone: string;
  guardianContactNo: string;
  guardianEmail?: string;

  // Academic Information
  currentClass: string;
  section: string;
  rollNumber: string;
  admitYear: string;
  admissionDate: string;
  admissionDateNepali?: string;
  previousSchool?: string;
  previousGrade?: string;
  previousPercentage?: number;
  subject?: string;

  // Personal Details
  caste?: string;
  motherTongue: string;
  disabilityType: string;
  bloodGroup?: string;

  // School Information
  schoolingSource?: string;
  scholarship?: string;
  currentScholarship?: string;

  // Status and Media
  status: "active" | "inactive" | "graduated" | "transferred";
  profileImage?: string;
  photo?: string;

  // Additional Information
  isTransferred: boolean;
  transferedToSchool?: string;
  transferDate?: string;
  medicalInfo?: string;
  notes?: string;

  // Sequelize timestamps
  createdAt?: string;
  updatedAt?: string;
}
// export interface SchoolProfile {
//   id: number;
//   schoolName: string;
//   schoolNameNepali?: string;
//   established: string;
//   mission: string;
//   vision: string;
//   address: string;
//   phone: string;
//   email: string;
//   website: string;
//   facebookUrl?: string;
//   province?: string;
//   district?: string;
//   municipality?: string;
//   ward?: string;
//   introduction?: string;
//   established?: string;
//   affiliation?: string;
//   schoolCode?: string;
//   logoUrl?: string;
//   panNumber?: string;
//   registrationNumber?: string;
//   affiliation?: string;
// }
