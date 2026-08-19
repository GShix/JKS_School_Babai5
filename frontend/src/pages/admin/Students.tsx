import React, { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Download
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';

import {
  schoolProfileService,
  studentService,
  type SchoolProfile
} from '../../api';

import { API_BASE_URL } from '../../api/config';

import {
  showError,
  showSuccess,
  showWarning,
  showDeleteConfirm
} from '../../utils/sweetAlert';

import {
  getProvinceOptions,
  getDistrictOptions,
  getLocalBodyOptions,
  getWardOptions
} from '../../utils/addressUtils';

import type {
  ClassItem,
  Student
} from '../../types';


// =========================================================
// FORM TYPE
// =========================================================

type StudentFormData = {
  currentSchool: string;
  iemisCode: string;
  studentId: string;

  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;

  gender: string;
  dob: string;
  dobNepali: string;
  isForeignStudent: boolean;

  permanentAddress: string;
  permanentProvince: string;
  permanentDistrict: string;
  permanentMunicipality: string;
  permanentWard: string;
  permanentTole: string;

  temporaryAddress: string;
  temporaryProvince: string;
  temporaryDistrict: string;
  temporaryMunicipality: string;
  temporaryWard: string;
  temporaryTole: string;
  sameAsPermAddress: boolean;

  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianPhone: string;
  guardianContactNo: string;
  guardianEmail: string;

  currentClass: string;
  section: string;
  admitYear: string;
  admissionDate: string;
  admissionDateNepali: string;
  previousSchool: string;
  previousGrade: string;
  previousPercentage: string;
  subject: string;

  caste: string;
  motherTongue: string;
  disabilityType: string;
  bloodGroup: string;

  schoolingSource: string;
  scholarship: string;
  currentScholarship: string;

  status: string;
  isTransferred: boolean;
  transferedToSchool: string;
  transferDate: string;

  contactNumber: string;
  medicalInfo: string;
  notes: string;
  address: string;
};


// =========================================================
// HELPERS
// =========================================================

const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')
  );
};


const getAuthHeaders = () => {
  const token = getToken();

  return token
    ? {
      Authorization: `Bearer ${token}`
    }
    : {};
};


const getAxiosErrorMessage = (
  error: unknown
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'string') {
      return data;
    }

    if (data?.error) {
      return String(data.error);
    }

    if (data?.message) {
      return String(data.message);
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};


// const normalizeString = (
//   value: unknown
// ): string => {
//   if (
//     value === null ||
//     value === undefined
//   ) {
//     return '';
//   }

//   return String(value).trim();
// };


// const excelValueToString = (
//   value: unknown
// ): string => {
//   if (
//     value === null ||
//     value === undefined ||
//     value === ''
//   ) {
//     return '';
//   }

//   if (value instanceof Date) {
//     const year = value.getFullYear();
//     const month = String(
//       value.getMonth() + 1
//     ).padStart(2, '0');

//     const day = String(
//       value.getDate()
//     ).padStart(2, '0');

//     return `${year}-${month}-${day}`;
//   }

//   if (typeof value === 'number') {
//     return String(value);
//   }

//   return String(value).trim();
// };


// =========================================================
// DEFAULT FORM
// =========================================================

// const isValidNepaliDate = (value: unknown): boolean => {
//   if (value === null || value === undefined || String(value).trim() === '') {
//     return true;
//   }

//   const valueString = String(value).trim();

//   // YYYY-MM-DD
//   return /^\d{4}-\d{1,2}-\d{1,2}$/.test(valueString);
// };

const createEmptyForm = (
  school?: SchoolProfile | null
): StudentFormData => ({
  currentSchool:
    school?.schoolName || '',

  iemisCode:
    school?.schoolCode || '',

  studentId: '',

  firstName: '',
  middleName: '',
  lastName: '',
  fullName: '',

  gender: '',
  dob: '',
  dobNepali: '',
  isForeignStudent: false,

  permanentAddress: '',
  permanentProvince: '',
  permanentDistrict: '',
  permanentMunicipality: '',
  permanentWard: '',
  permanentTole: '',

  temporaryAddress: '',
  temporaryProvince: '',
  temporaryDistrict: '',
  temporaryMunicipality: '',
  temporaryWard: '',
  temporaryTole: '',
  sameAsPermAddress: false,

  fatherName: '',
  motherName: '',
  guardianName: '',
  guardianPhone: '',
  guardianContactNo: '',
  guardianEmail: '',

  currentClass: '',
  section: '',
  admitYear: '',
  admissionDate: '',
  admissionDateNepali: '',
  previousSchool: '',
  previousGrade: '',
  previousPercentage: '',
  subject: '',

  caste: '',
  motherTongue: '',
  disabilityType: '',
  bloodGroup: '',

  schoolingSource: '',
  scholarship: '',
  currentScholarship: '',

  status: 'active',
  isTransferred: false,
  transferedToSchool: '',
  transferDate: '',

  contactNumber: '',
  medicalInfo: '',
  notes: '',
  address: ''
});


// =========================================================
// COMPONENT
// =========================================================

const Students: React.FC = () => {
  const [
    schoolProfile,
    setSchoolProfile
  ] = useState<SchoolProfile | null>(null);

  const [
    classes,
    setClasses
  ] = useState<ClassItem[]>([]);

  const [
    students,
    setStudents
  ] = useState<Student[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    showModal,
    setShowModal
  ] = useState(false);

  const [
    editingStudent,
    setEditingStudent
  ] = useState<Student | null>(null);

  const [
    showImportModal,
    setShowImportModal
  ] = useState(false);

  const [
    importFile,
    setImportFile
  ] = useState<File | null>(null);

  const [
    importData,
    setImportData
  ] = useState<any[]>([]);

  const [
    validationErrors,
    setValidationErrors
  ] = useState<string[]>([]);

  const [
    formData,
    setFormData
  ] = useState<StudentFormData>(
    createEmptyForm()
  );

  const [
    selectedImage,
    setSelectedImage
  ] = useState<File | null>(null);

  const [
    imagePreview,
    setImagePreview
  ] = useState<string | null>(null);


  // =======================================================
  // ADDRESS OPTIONS
  // =======================================================

  const [
    permanentDistrictOptions,
    setPermanentDistrictOptions
  ] = useState<
    { value: string; label: string }[]
  >([
    {
      value: '',
      label: 'Select District'
    }
  ]);

  const [
    permanentLocalBodyOptions,
    setPermanentLocalBodyOptions
  ] = useState<
    { value: string; label: string }[]
  >([
    {
      value: '',
      label: 'Select Local Body'
    }
  ]);

  const [
    permanentWardOptions,
    setPermanentWardOptions
  ] = useState<
    { value: string; label: string }[]
  >([
    {
      value: '',
      label: 'Select Ward'
    }
  ]);


  const [
    temporaryDistrictOptions,
    setTemporaryDistrictOptions
  ] = useState<
    { value: string; label: string }[]
  >([
    {
      value: '',
      label: 'Select District'
    }
  ]);

  const [
    temporaryLocalBodyOptions,
    setTemporaryLocalBodyOptions
  ] = useState<
    { value: string; label: string }[]
  >([
    {
      value: '',
      label: 'Select Local Body'
    }
  ]);

  const [
    temporaryWardOptions,
    setTemporaryWardOptions
  ] = useState<
    { value: string; label: string }[]
  >([
    {
      value: '',
      label: 'Select Ward'
    }
  ]);


  // =======================================================
  // SCHOOL PROFILE
  // =======================================================

  const fetchSchoolProfile =
    useCallback(async () => {
      try {
        const response =
          await schoolProfileService.get();

        const schoolData =
          response.data;

        if (schoolData) {
          setSchoolProfile(
            schoolData
          );

          setFormData(
            prev => ({
              ...prev,

              currentSchool:
                schoolData.schoolName ||
                prev.currentSchool,

              iemisCode:
                schoolData.schoolCode ||
                prev.iemisCode
            })
          );
        }
      } catch (error) {
        console.error(
          'Error fetching school profile:',
          error
        );
      }
    }, []);


  // =======================================================
  // FETCH CLASSES
  // =======================================================

  const fetchClasses =
    useCallback(async () => {
      try {
        const response =
          await axios.get(
            `${API_BASE_URL}/classes`,
            {
              headers:
                getAuthHeaders()
            }
          );

        const classData =
          response.data?.data;

        setClasses(
          Array.isArray(classData)
            ? classData
            : []
        );
      } catch (error) {
        console.error(
          'Error fetching classes:',
          error
        );

        showError(
          `Failed to load classes: ${getAxiosErrorMessage(
            error
          )}`
        );
      }
    }, []);


  // =======================================================
  // FETCH STUDENTS
  // =======================================================

  const fetchStudents =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await axios.get(
            `${API_BASE_URL}/students`,
            {
              headers:
                getAuthHeaders()
            }
          );

        const studentData =
          response.data?.data;

        setStudents(
          Array.isArray(studentData)
            ? studentData
            : []
        );
      } catch (error) {
        console.error(
          'Error fetching students:',
          error
        );

        showError(
          `Failed to load students: ${getAxiosErrorMessage(
            error
          )}`
        );
      } finally {
        setLoading(false);
      }
    }, []);


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    fetchSchoolProfile();
    fetchClasses();
    fetchStudents();
  }, [
    fetchSchoolProfile,
    fetchClasses,
    fetchStudents
  ]);


  // =======================================================
  // PERMANENT ADDRESS CASCADING
  // =======================================================

  useEffect(() => {
    if (
      formData.permanentProvince
    ) {
      setPermanentDistrictOptions(
        getDistrictOptions(
          formData.permanentProvince
        )
      );
    } else {
      setPermanentDistrictOptions([
        {
          value: '',
          label: 'Select District'
        }
      ]);

      setPermanentLocalBodyOptions([
        {
          value: '',
          label: 'Select Local Body'
        }
      ]);

      setPermanentWardOptions([
        {
          value: '',
          label: 'Select Ward'
        }
      ]);
    }
  }, [
    formData.permanentProvince
  ]);


  useEffect(() => {
    if (
      formData.permanentProvince &&
      formData.permanentDistrict
    ) {
      setPermanentLocalBodyOptions(
        getLocalBodyOptions(
          formData.permanentProvince,
          formData.permanentDistrict
        )
      );
    } else {
      setPermanentLocalBodyOptions([
        {
          value: '',
          label: 'Select Local Body'
        }
      ]);

      setPermanentWardOptions([
        {
          value: '',
          label: 'Select Ward'
        }
      ]);
    }
  }, [
    formData.permanentProvince,
    formData.permanentDistrict
  ]);


  useEffect(() => {
    if (
      formData.permanentProvince &&
      formData.permanentDistrict &&
      formData.permanentMunicipality
    ) {
      setPermanentWardOptions(
        getWardOptions(
          formData.permanentProvince,
          formData.permanentDistrict,
          formData.permanentMunicipality
        )
      );
    } else {
      setPermanentWardOptions([
        {
          value: '',
          label: 'Select Ward'
        }
      ]);
    }
  }, [
    formData.permanentProvince,
    formData.permanentDistrict,
    formData.permanentMunicipality
  ]);


  // =======================================================
  // TEMPORARY ADDRESS CASCADING
  // =======================================================

  useEffect(() => {
    if (
      formData.temporaryProvince
    ) {
      setTemporaryDistrictOptions(
        getDistrictOptions(
          formData.temporaryProvince
        )
      );
    } else {
      setTemporaryDistrictOptions([
        {
          value: '',
          label: 'Select District'
        }
      ]);

      setTemporaryLocalBodyOptions([
        {
          value: '',
          label: 'Select Local Body'
        }
      ]);

      setTemporaryWardOptions([
        {
          value: '',
          label: 'Select Ward'
        }
      ]);
    }
  }, [
    formData.temporaryProvince
  ]);


  useEffect(() => {
    if (
      formData.temporaryProvince &&
      formData.temporaryDistrict
    ) {
      setTemporaryLocalBodyOptions(
        getLocalBodyOptions(
          formData.temporaryProvince,
          formData.temporaryDistrict
        )
      );
    } else {
      setTemporaryLocalBodyOptions([
        {
          value: '',
          label: 'Select Local Body'
        }
      ]);

      setTemporaryWardOptions([
        {
          value: '',
          label: 'Select Ward'
        }
      ]);
    }
  }, [
    formData.temporaryProvince,
    formData.temporaryDistrict
  ]);


  useEffect(() => {
    if (
      formData.temporaryProvince &&
      formData.temporaryDistrict &&
      formData.temporaryMunicipality
    ) {
      setTemporaryWardOptions(
        getWardOptions(
          formData.temporaryProvince,
          formData.temporaryDistrict,
          formData.temporaryMunicipality
        )
      );
    } else {
      setTemporaryWardOptions([
        {
          value: '',
          label: 'Select Ward'
        }
      ]);
    }
  }, [
    formData.temporaryProvince,
    formData.temporaryDistrict,
    formData.temporaryMunicipality
  ]);


  // =======================================================
  // BUILD ADDRESSES
  // =======================================================

  const buildPermanentAddress =
    useCallback(() => {
      const parts = [
        formData.permanentMunicipality &&
          formData.permanentWard
          ? `${formData.permanentMunicipality} - ${formData.permanentWard}`
          : formData.permanentMunicipality ||
          formData.permanentWard,

        formData.permanentDistrict,

        formData.permanentTole
      ].filter(Boolean);

      return parts.join(', ');
    }, [
      formData.permanentMunicipality,
      formData.permanentWard,
      formData.permanentDistrict,
      formData.permanentTole
    ]);


  const buildTemporaryAddress =
    useCallback(() => {
      const parts = [
        formData.temporaryMunicipality &&
          formData.temporaryWard
          ? `${formData.temporaryMunicipality} - ${formData.temporaryWard}`
          : formData.temporaryMunicipality ||
          formData.temporaryWard,

        formData.temporaryDistrict,

        formData.temporaryTole
      ].filter(Boolean);

      return parts.join(', ');
    }, [
      formData.temporaryMunicipality,
      formData.temporaryWard,
      formData.temporaryDistrict,
      formData.temporaryTole
    ]);


  // =======================================================
  // RESET IMPORT
  // =======================================================

  const resetImportState =
    useCallback(() => {
      setImportFile(null);
      setImportData([]);
      setValidationErrors([]);
    }, []);


  // =======================================================
  // DOWNLOAD EXCEL TEMPLATE
  // =======================================================

  const downloadSampleTemplate =
    () => {
      const sampleData = [
        {
          'S.N': '',
          'IEMIS Code':
            schoolProfile?.schoolCode || '',
          'Current School':
            schoolProfile?.schoolName || '',

          'Student Id':
            '5602700068300009',

          FullName:
            'Aariya Thapa',

          Gender:
            'Female',

          'Father Name':
            'Ram Shrestha',

          'Mother Name':
            'Sita Shrestha',

          CurrentClass:
            '10',

          Section:
            'A',

          Year:
            '2083',

          'Permanent Address':
            'Babai-1, Dang',

          'Temporary Address':
            'Babai-1, Dang',

          DOB:
            '2073-12-12',

          'Is Transferred':
            'No',

          'Mother Tongue':
            'Nepali',

          'Disability Type':
            'No Disability',

          Age:
            '10',

          'Guardian Name':
            'Maya Shrestha',

          'Guardian Contact Number':
            '9801234567'
        }
      ];

      const worksheet =
        XLSX.utils.json_to_sheet(
          sampleData
        );

      worksheet['!cols'] = [
        { wch: 8 },
        { wch: 15 },
        { wch: 25 },
        { wch: 22 },
        { wch: 22 },
        { wch: 12 },
        { wch: 22 },
        { wch: 22 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 30 },
        { wch: 30 },
        { wch: 16 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
        { wch: 10 },
        { wch: 22 },
        { wch: 25 }
      ];

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Students'
      );

      XLSX.writeFile(
        workbook,
        'Student_Import_Template.xlsx'
      );

      showSuccess(
        'Sample template downloaded successfully!'
      );
    };


  // =======================================================
  // HANDLE EXCEL FILE
  // =======================================================

  const handleImportFileChange =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      const validExtension =
        /\.(xlsx|xls)$/i.test(
          file.name
        );

      if (
        !validTypes.includes(
          file.type
        ) &&
        !validExtension
      ) {
        showWarning(
          'Invalid file type',
          'Please select an Excel file (.xlsx or .xls)'
        );

        e.target.value = '';

        return;
      }

      setImportFile(file);

      parseExcelFile(file);
    };


  // =======================================================
  // VALIDATE + TRANSFORM EXCEL
  // =======================================================

  const validateImportData = (data: any[]) => {
    const errors: string[] = [];
    const validData: any[] = [];

    // =========================================================
    // NORMALIZE EXCEL HEADER
    // =========================================================

    const normalizeHeader = (header: any): string => {
      return String(header ?? '')
        .trim()
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[\s_\-./]+/g, '');
    };

    // =========================================================
    // NORMALIZE VALUE
    // =========================================================

    const cleanValue = (value: any): string => {
      if (
        value === null ||
        value === undefined
      ) {
        return '';
      }

      return String(value).trim();
    };

    // =========================================================
    // HEADER ALIASES
    // =========================================================

    const columnAliases: Record<string, string> = {
      iemiscode: 'iemisCode',
      iemis: 'iemisCode',

      currentschool: 'currentSchool',
      school: 'currentSchool',
      schoolname: 'currentSchool',

      studentid: 'studentId',
      studentcode: 'studentId',

      fullname: 'fullName',
      studentname: 'fullName',
      name: 'fullName',

      firstname: 'firstName',
      middlename: 'middleName',
      lastname: 'lastName',

      gender: 'gender',

      fathername: 'fatherName',
      fathersname: 'fatherName',

      mothername: 'motherName',
      mothersname: 'motherName',

      guardian: 'guardianName',
      guardianname: 'guardianName',
      guardiansname: 'guardianName',

      guardianphone: 'guardianPhone',
      guardiancontact: 'guardianContactNo',
      guardiancontactno: 'guardianContactNo',
      guardiancontactnumber: 'guardianContactNo',
      guardianphonenumber: 'guardianContactNo',

      currentclass: 'currentClass',
      class: 'currentClass',
      classname: 'currentClass',

      section: 'section',

      year: 'admitYear',
      admityear: 'admitYear',
      admissionyear: 'admitYear',

      permanentaddress: 'permanentAddress',
      temporaryaddress: 'temporaryAddress',

      province: 'permanentProvince',
      permanentprovince: 'permanentProvince',

      district: 'permanentDistrict',
      permanentdistrict: 'permanentDistrict',

      municipality: 'permanentMunicipality',
      localbody: 'permanentMunicipality',
      permanentmunicipality: 'permanentMunicipality',

      ward: 'permanentWard',
      permanentward: 'permanentWard',

      tole: 'permanentTole',
      permanenttole: 'permanentTole',

      temporaryprovince: 'temporaryProvince',
      temporarydistrict: 'temporaryDistrict',
      temporarymunicipality: 'temporaryMunicipality',
      temporaryward: 'temporaryWard',
      temporarytole: 'temporaryTole',

      dob: 'dob',
      dateofbirth: 'dob',

      dobnepali: 'dobNepali',
      nepaliDateofbirth: 'dobNepali',

      istransferred: 'isTransferred',
      transferred: 'isTransferred',

      mothertongue: 'motherTongue',

      disabilitytype: 'disabilityType',

      age: 'age',

      caste: 'caste',

      bloodgroup: 'bloodGroup',

      contactnumber: 'contactNumber',
      contact: 'contactNumber',
      phone: 'contactNumber',

      admissionsdate: 'admissionDate',
      admissiondate: 'admissionDate',

      previousschool: 'previousSchool',

      previousgrade: 'previousGrade',

      previouspercentage: 'previousPercentage',

      scholarship: 'scholarship',

      currentscholarship: 'currentScholarship'
    };

    // =========================================================
    // BOOLEAN CONVERTER
    // =========================================================

    const toBoolean = (value: any): boolean => {
      if (typeof value === 'boolean') {
        return value;
      }

      const normalized = cleanValue(value)
        .toLowerCase();

      return [
        'yes',
        'true',
        '1',
        'transferred',
        'y'
      ].includes(normalized);
    };

    // =========================================================
    // FULL NAME PARSER
    // =========================================================

    const parseFullName = (
      fullName: any
    ) => {
      const name = cleanValue(fullName);

      if (!name) {
        return {
          firstName: '',
          middleName: '',
          lastName: '',
          fullName: ''
        };
      }

      const parts = name
        .split(/\s+/)
        .filter(Boolean);

      if (parts.length === 1) {
        return {
          firstName: parts[0],
          middleName: '',
          lastName: '',
          fullName: parts[0]
        };
      }

      if (parts.length === 2) {
        return {
          firstName: parts[0],
          middleName: '',
          lastName: parts[1],
          fullName: parts.join(' ')
        };
      }

      return {
        firstName: parts[0],
        middleName: parts
          .slice(1, -1)
          .join(' '),
        lastName: parts[parts.length - 1],
        fullName: parts.join(' ')
      };
    };

    // =========================================================
    // PROCESS EACH EXCEL ROW
    // =========================================================

    data.forEach((row, index) => {
      const rowNum = index + 2;

      const rowData =
        row as Record<string, any>;

      const transformedRow: Record<
        string,
        any
      > = {};

      // -------------------------------------------------------
      // MAP EXCEL COLUMNS
      // -------------------------------------------------------

      Object.entries(rowData).forEach(
        ([originalKey, originalValue]) => {
          const normalizedKey =
            normalizeHeader(originalKey);

          // Ignore S.N
          if (
            normalizedKey === 'sn' ||
            normalizedKey === 'serialnumber' ||
            normalizedKey === 'serialno'
          ) {
            return;
          }

          const mappedKey =
            columnAliases[normalizedKey];

          if (!mappedKey) {
            // Unknown columns are preserved
            // but don't override important fields.
            return;
          }

          transformedRow[mappedKey] =
            cleanValue(originalValue);
        }
      );

      // -------------------------------------------------------
      // SCHOOL INFORMATION
      // Always use current school profile
      // -------------------------------------------------------

      transformedRow.currentSchool =
        schoolProfile?.schoolName || '';

      transformedRow.iemisCode =
        schoolProfile?.schoolCode ||
        transformedRow.iemisCode ||
        '';

      // -------------------------------------------------------
      // FULL NAME
      // -------------------------------------------------------

      const nameData =
        parseFullName(
          transformedRow.fullName
        );

      transformedRow.firstName =
        transformedRow.firstName ||
        nameData.firstName;

      transformedRow.middleName =
        transformedRow.middleName ||
        nameData.middleName;

      transformedRow.lastName =
        transformedRow.lastName ||
        nameData.lastName;

      transformedRow.fullName =
        [
          transformedRow.firstName,
          transformedRow.middleName,
          transformedRow.lastName
        ]
          .filter(Boolean)
          .join(' ');

      // -------------------------------------------------------
      // REQUIRED VALIDATION
      // -------------------------------------------------------

      // Student name
      if (!transformedRow.fullName) {
        errors.push(
          `Row ${rowNum}: Student name is required`
        );
      }

      // Current class
      if (!transformedRow.currentClass) {
        errors.push(
          `Row ${rowNum}: Current Class is required`
        );
      }

      // -------------------------------------------------------
      // GUARDIAN IS OPTIONAL
      // -------------------------------------------------------
      //
      // IMPORTANT:
      // Guardian Name is deliberately NOT validated.
      //
      // Do NOT add:
      //
      // if (!transformedRow.guardianName) {
      //   errors.push(...)
      // }
      //
      // -------------------------------------------------------

      transformedRow.guardianName =
        cleanValue(
          transformedRow.guardianName
        );

      transformedRow.guardianContactNo =
        cleanValue(
          transformedRow.guardianContactNo
        );

      transformedRow.guardianPhone =
        cleanValue(
          transformedRow.guardianPhone
        );

      // -------------------------------------------------------
      // TRANSFER STATUS
      // -------------------------------------------------------

      transformedRow.isTransferred =
        toBoolean(
          transformedRow.isTransferred
        );

      transformedRow.status =
        transformedRow.isTransferred
          ? 'transferred'
          : 'active';

      // -------------------------------------------------------
      // DEFAULT VALUES
      // -------------------------------------------------------

      transformedRow.isForeignStudent =
        false;

      transformedRow.sameAsPermAddress =
        false;

      transformedRow.admitYear =
        cleanValue(
          transformedRow.admitYear
        );

      transformedRow.dob =
        cleanValue(
          transformedRow.dob
        ) || null;

      transformedRow.dobNepali =
        cleanValue(
          transformedRow.dobNepali
        ) || null;

      transformedRow.currentClass =
        cleanValue(
          transformedRow.currentClass
        );

      transformedRow.section =
        cleanValue(
          transformedRow.section
        );

      transformedRow.gender =
        cleanValue(
          transformedRow.gender
        );

      transformedRow.studentId =
        cleanValue(
          transformedRow.studentId
        );

      transformedRow.fatherName =
        cleanValue(
          transformedRow.fatherName
        );

      transformedRow.motherName =
        cleanValue(
          transformedRow.motherName
        );

      transformedRow.motherTongue =
        cleanValue(
          transformedRow.motherTongue
        );

      transformedRow.disabilityType =
        cleanValue(
          transformedRow.disabilityType
        );

      transformedRow.permanentAddress =
        cleanValue(
          transformedRow.permanentAddress
        );

      transformedRow.temporaryAddress =
        cleanValue(
          transformedRow.temporaryAddress
        );

      // -------------------------------------------------------
      // ADDRESS DEFAULTS
      // -------------------------------------------------------

      transformedRow.permanentProvince =
        cleanValue(
          transformedRow.permanentProvince
        );

      transformedRow.permanentDistrict =
        cleanValue(
          transformedRow.permanentDistrict
        );

      transformedRow.permanentMunicipality =
        cleanValue(
          transformedRow.permanentMunicipality
        );

      transformedRow.permanentWard =
        cleanValue(
          transformedRow.permanentWard
        );

      transformedRow.permanentTole =
        cleanValue(
          transformedRow.permanentTole
        );

      transformedRow.temporaryProvince =
        cleanValue(
          transformedRow.temporaryProvince
        );

      transformedRow.temporaryDistrict =
        cleanValue(
          transformedRow.temporaryDistrict
        );

      transformedRow.temporaryMunicipality =
        cleanValue(
          transformedRow.temporaryMunicipality
        );

      transformedRow.temporaryWard =
        cleanValue(
          transformedRow.temporaryWard
        );

      transformedRow.temporaryTole =
        cleanValue(
          transformedRow.temporaryTole
        );

      // -------------------------------------------------------
      // OTHER OPTIONAL FIELDS
      // -------------------------------------------------------

      transformedRow.caste =
        cleanValue(
          transformedRow.caste
        );

      transformedRow.bloodGroup =
        cleanValue(
          transformedRow.bloodGroup
        );

      transformedRow.contactNumber =
        cleanValue(
          transformedRow.contactNumber
        );

      transformedRow.previousSchool =
        cleanValue(
          transformedRow.previousSchool
        );

      transformedRow.previousGrade =
        cleanValue(
          transformedRow.previousGrade
        );

      transformedRow.previousPercentage =
        cleanValue(
          transformedRow.previousPercentage
        );

      transformedRow.scholarship =
        cleanValue(
          transformedRow.scholarship
        );

      transformedRow.currentScholarship =
        cleanValue(
          transformedRow.currentScholarship
        );

      // -------------------------------------------------------
      // ADD LEGACY ADDRESS
      // -------------------------------------------------------

      if (
        !transformedRow.address &&
        transformedRow.permanentAddress
      ) {
        transformedRow.address =
          transformedRow.permanentAddress;
      }

      // -------------------------------------------------------
      // ALWAYS KEEP THE ROW
      // -------------------------------------------------------

      validData.push(
        transformedRow
      );
    });

    return {
      validData,
      errors
    };
  };

  // =======================================================
  // PARSE EXCEL
  // =======================================================

  const parseExcelFile =
    (file: File) => {
      const reader =
        new FileReader();

      reader.onload =
        e => {
          try {
            const data =
              e.target?.result;

            if (!data) {
              showError(
                'Could not read the selected Excel file.'
              );

              return;
            }

            const workbook =
              XLSX.read(
                data,
                {
                  type: 'binary',
                  cellDates: true
                }
              );

            if (
              workbook.SheetNames.length ===
              0
            ) {
              showWarning(
                'Invalid Excel file',
                'No worksheet was found.'
              );

              return;
            }

            const worksheet =
              workbook.Sheets[
              workbook.SheetNames[0]
              ];

            const jsonData =
              XLSX.utils.sheet_to_json(
                worksheet,
                {
                  defval: ''
                }
              );

            if (
              jsonData.length ===
              0
            ) {
              showWarning(
                'Empty file',
                'The Excel file is empty. Please add data and try again.'
              );

              return;
            }

            const {
              validData,
              errors
            } =
              validateImportData(
                jsonData
              );

            setImportData(
              validData
            );

            setValidationErrors(
              errors
            );

            if (
              errors.length > 0
            ) {
              showWarning(
                'Validation warnings',
                `Found ${errors.length} validation issue(s). Invalid rows have been excluded from import.`
              );
            } else {
              showSuccess(
                `${validData.length} student record(s) are ready to import.`
              );
            }
          } catch (error) {
            console.error(
              'Error parsing Excel file:',
              error
            );

            showError(
              `Failed to parse Excel file: ${getAxiosErrorMessage(
                error
              )}`
            );
          }
        };

      reader.onerror =
        () => {
          showError(
            'Failed to read the Excel file.'
          );
        };

      reader.readAsBinaryString(
        file
      );
    };


  // =======================================================
  // IMPORT CONFIRM
  // =======================================================

  const handleImportConfirm =
    async () => {
      if (
        importData.length === 0
      ) {
        showWarning(
          'No valid data to import',
          'Please select an Excel file containing valid student records.'
        );

        return;
      }


      if (
        validationErrors.length > 0
      ) {
        showWarning(
          'Fix validation errors first',
          'Some rows contain required-field errors. Please correct the Excel file and upload it again.'
        );

        return;
      }


      try {
        setLoading(true);

        let successCount =
          0;

        let failCount =
          0;

        const failedRows: {
          row: number;
          error: string;
        }[] = [];


        for (
          let i = 0;
          i < importData.length;
          i++
        ) {
          const row =
            importData[i];

          try {
            await studentService.create(
              row
            );

            successCount++;
          } catch (error) {
            console.error(
              `Error importing row ${i + 2
              }:`,
              error
            );

            failCount++;

            failedRows.push({
              row: i + 2,
              error:
                getAxiosErrorMessage(
                  error
                )
            });
          }
        }


        await fetchStudents();


        if (
          failCount === 0
        ) {
          setShowImportModal(
            false
          );

          resetImportState();

          showSuccess(
            `Successfully imported ${successCount} student(s)!`
          );

          return;
        }


        const failedMessage =
          failedRows
            .slice(0, 10)
            .map(
              item =>
                `Row ${item.row}: ${item.error}`
            )
            .join('\n');


        if (
          successCount > 0
        ) {
          showWarning(
            'Import completed with errors',
            `Successfully imported: ${successCount}\nFailed: ${failCount}\n\n${failedMessage}`
          );
        } else {
          showError(
            `No students were imported.\n\n${failedMessage}`
          );
        }
      } catch (error) {
        console.error(
          'Error importing students:',
          error
        );

        showError(
          `Failed to import students: ${getAxiosErrorMessage(
            error
          )}`
        );
      } finally {
        setLoading(false);
      }
    };


  // =======================================================
  // BUILD FORM DATA
  // =======================================================

  const buildStudentFormData =
    () => {
      const submitData =
        new FormData();

      const permanentAddress =
        buildPermanentAddress();

      const temporaryAddress =
        buildTemporaryAddress();

      const fullName =
        [
          formData.firstName,
          formData.middleName,
          formData.lastName
        ]
          .map(
            value =>
              value.trim()
          )
          .filter(Boolean)
          .join(' ');


      const finalData = {
        ...formData,

        fullName,

        currentSchool:
          schoolProfile?.schoolName ||
          formData.currentSchool ||
          '',

        iemisCode:
          schoolProfile?.schoolCode ||
          formData.iemisCode ||
          '',

        permanentAddress,

        temporaryAddress,

        address:
          permanentAddress
      };


      Object.entries(
        finalData
      ).forEach(
        (
          [key, value]
        ) => {
          if (
            value !== null &&
            value !== undefined
          ) {
            submitData.append(
              key,
              String(value)
            );
          }
        }
      );


      if (
        selectedImage
      ) {
        submitData.append(
          'photo',
          selectedImage
        );
      }


      return submitData;
    };


  // =======================================================
  // SUBMIT STUDENT
  // =======================================================

  const handleSubmit =
    async (
      e?: React.FormEvent
    ) => {
      e?.preventDefault();


      if (submitting) {
        return;
      }


      if (
        !formData.firstName.trim() &&
        !formData.fullName.trim()
      ) {
        showWarning(
          'Student name required',
          'Please enter the student name.'
        );

        return;
      }


      if (
        !formData.currentClass
      ) {
        showWarning(
          'Class required',
          'Please select the current class.'
        );

        return;
      }


      if (
        !formData.guardianName.trim()
      ) {
        showWarning(
          'Guardian required',
          'Please enter the guardian name.'
        );

        return;
      }


      try {
        setSubmitting(true);

        const submitData =
          buildStudentFormData();

        const token =
          getToken();


        if (!token) {
          showError(
            'Authentication token not found. Please login again.'
          );

          return;
        }


        if (
          editingStudent
        ) {
          await axios.put(
            `${API_BASE_URL}/students/${editingStudent.id}/update`,
            submitData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );
        } else {
          await axios.post(
            `${API_BASE_URL}/students/create`,
            submitData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );
        }


        await fetchStudents();


        setShowModal(
          false
        );

        setEditingStudent(
          null
        );

        resetForm();


        showSuccess(
          `Student has been ${editingStudent
            ? 'updated'
            : 'added'
          } successfully!`
        );
      } catch (error) {
        console.error(
          'Error saving student:',
          error
        );


        const message =
          getAxiosErrorMessage(
            error
          );


        showError(
          `Failed to ${editingStudent
            ? 'update'
            : 'create'
          } student.\n\n${message}`
        );
      } finally {
        setSubmitting(false);
      }
    };


  // =======================================================
  // DELETE
  // =======================================================

  const handleDelete =
    async (
      id: number
    ) => {
      const result =
        await showDeleteConfirm(
          'this student'
        );

      if (
        !result.isConfirmed
      ) {
        return;
      }


      try {
        const token =
          getToken();


        if (!token) {
          showError(
            'Authentication token not found. Please login again.'
          );

          return;
        }


        await axios.delete(
          `${API_BASE_URL}/students/${id}/delete`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


        await fetchStudents();


        showSuccess(
          'Student has been deleted successfully!'
        );
      } catch (error) {
        console.error(
          'Error deleting student:',
          error
        );


        showError(
          `Failed to delete student: ${getAxiosErrorMessage(
            error
          )}`
        );
      }
    };


  // =======================================================
  // EDIT
  // =======================================================

  const handleEdit =
    (
      student: Student
    ) => {
      setEditingStudent(
        student
      );


      const nameParts =
        student.fullName
          ?.trim()
          .split(/\s+/)
          .filter(Boolean) ||
        [];


      setFormData({
        currentSchool:
          schoolProfile?.schoolName ||
          '',

        iemisCode:
          student.iemisCode ||
          schoolProfile?.schoolCode ||
          '',

        studentId:
          student.studentId ||
          '',

        firstName:
          student.firstName ||
          nameParts[0] ||
          '',

        middleName:
          student.middleName ||
          '',

        lastName:
          student.lastName ||
          (
            nameParts.length > 1
              ? nameParts
                .slice(1)
                .join(' ')
              : ''
          ),

        fullName:
          student.fullName ||
          '',

        gender:
          student.gender ||
          '',

        dob:
          student.dob ||
          '',

        dobNepali:
          student.dobNepali ||
          '',

        isForeignStudent:
          student.isForeignStudent ||
          false,


        permanentAddress:
          student.permanentAddress ||
          '',

        permanentProvince:
          student.permanentProvince ||
          '',

        permanentDistrict:
          student.permanentDistrict ||
          '',

        permanentMunicipality:
          student.permanentMunicipality ||
          '',

        permanentWard:
          student.permanentWard ||
          '',

        permanentTole:
          student.permanentTole ||
          '',


        temporaryAddress:
          student.temporaryAddress ||
          '',

        temporaryProvince:
          student.temporaryProvince ||
          '',

        temporaryDistrict:
          student.temporaryDistrict ||
          '',

        temporaryMunicipality:
          student.temporaryMunicipality ||
          '',

        temporaryWard:
          student.temporaryWard ||
          '',

        temporaryTole:
          student.temporaryTole ||
          '',

        sameAsPermAddress:
          student.sameAsPermAddress ||
          false,


        fatherName:
          student.fatherName ||
          '',

        motherName:
          student.motherName ||
          '',

        guardianName:
          student.guardianName ||
          '',

        guardianPhone:
          student.guardianPhone ||
          '',

        guardianContactNo:
          student.guardianContactNo ||
          '',

        guardianEmail:
          student.guardianEmail ||
          '',


        currentClass:
          student.currentClass
            ? String(
              student.currentClass
            )
            : '',

        section:
          student.section ||
          '',

        admitYear:
          student.admitYear
            ? String(
              student.admitYear
            )
            : '',

        admissionDate:
          student.admissionDate ||
          '',

        admissionDateNepali:
          student.admissionDateNepali ||
          '',

        previousSchool:
          student.previousSchool ||
          '',

        previousGrade:
          student.previousGrade ||
          '',

        previousPercentage:
          student.previousPercentage !==
            null &&
            student.previousPercentage !==
            undefined
            ? String(
              student.previousPercentage
            )
            : '',

        subject:
          student.subject ||
          '',


        caste:
          student.caste ||
          '',

        motherTongue:
          student.motherTongue ||
          '',

        disabilityType:
          student.disabilityType ||
          '',

        bloodGroup:
          student.bloodGroup ||
          '',


        schoolingSource:
          student.schoolingSource ||
          '',

        scholarship:
          student.scholarship ||
          '',

        currentScholarship:
          student.currentScholarship ||
          '',


        status:
          student.status ||
          'active',

        isTransferred:
          student.isTransferred ||
          false,

        transferedToSchool:
          student.transferedToSchool ||
          '',

        transferDate:
          student.transferDate ||
          '',


        contactNumber:
          student.contactNumber ||
          '',

        medicalInfo:
          student.medicalInfo ||
          '',

        notes:
          student.notes ||
          '',

        address:
          student.address ||
          ''
      });


      setSelectedImage(
        null
      );

      setImagePreview(
        null
      );

      setShowModal(
        true
      );
    };


  // =======================================================
  // RESET FORM
  // =======================================================

  const resetForm =
    () => {
      setFormData(
        createEmptyForm(
          schoolProfile
        )
      );

      setSelectedImage(
        null
      );

      setImagePreview(
        null
      );
    };


  // =======================================================
  // IMAGE
  // =======================================================

  const handleImageChange =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }


      if (
        file.size >
        2 * 1024 * 1024
      ) {
        showError(
          'File size must be less than 2MB.'
        );

        e.target.value = '';

        return;
      }


      if (
        !file.type.startsWith(
          'image/'
        )
      ) {
        showError(
          'Please select an image file.'
        );

        e.target.value = '';

        return;
      }


      setSelectedImage(
        file
      );


      const reader =
        new FileReader();


      reader.onloadend =
        () => {
          setImagePreview(
            reader.result as string
          );
        };


      reader.readAsDataURL(
        file
      );
    };


  // =======================================================
  // SAME ADDRESS
  // =======================================================

  const handleSameAddressChange =
    (
      checked: boolean
    ) => {
      setFormData(
        prev => ({
          ...prev,

          sameAsPermAddress:
            checked,

          ...(checked
            ? {
              temporaryProvince:
                prev.permanentProvince,

              temporaryDistrict:
                prev.permanentDistrict,

              temporaryMunicipality:
                prev.permanentMunicipality,

              temporaryWard:
                prev.permanentWard,

              temporaryTole:
                prev.permanentTole
            }
            : {})
        })
      );
    };


  // =======================================================
  // PERMANENT ADDRESS HANDLERS
  // =======================================================

  const handlePermanentProvinceChange =
    (
      value: string
    ) => {
      setFormData(
        prev => ({
          ...prev,

          permanentProvince:
            value,

          permanentDistrict:
            '',

          permanentMunicipality:
            '',

          permanentWard:
            '',

          ...(prev.sameAsPermAddress
            ? {
              temporaryProvince:
                value,

              temporaryDistrict:
                '',

              temporaryMunicipality:
                '',

              temporaryWard:
                ''
            }
            : {})
        })
      );
    };


  const handlePermanentDistrictChange =
    (
      value: string
    ) => {
      setFormData(
        prev => ({
          ...prev,

          permanentDistrict:
            value,

          permanentMunicipality:
            '',

          permanentWard:
            '',

          ...(prev.sameAsPermAddress
            ? {
              temporaryDistrict:
                value,

              temporaryMunicipality:
                '',

              temporaryWard:
                ''
            }
            : {})
        })
      );
    };


  const handlePermanentMunicipalityChange =
    (
      value: string
    ) => {
      setFormData(
        prev => ({
          ...prev,

          permanentMunicipality:
            value,

          permanentWard:
            '',

          ...(prev.sameAsPermAddress
            ? {
              temporaryMunicipality:
                value,

              temporaryWard:
                ''
            }
            : {})
        })
      );
    };


  // =======================================================
  // TEMPORARY ADDRESS HANDLERS
  // =======================================================

  const handleTemporaryProvinceChange =
    (
      value: string
    ) => {
      setFormData(
        prev => ({
          ...prev,

          temporaryProvince:
            value,

          temporaryDistrict:
            '',

          temporaryMunicipality:
            '',

          temporaryWard:
            ''
        })
      );
    };


  const handleTemporaryDistrictChange =
    (
      value: string
    ) => {
      setFormData(
        prev => ({
          ...prev,

          temporaryDistrict:
            value,

          temporaryMunicipality:
            '',

          temporaryWard:
            ''
        })
      );
    };


  const handleTemporaryMunicipalityChange =
    (
      value: string
    ) => {
      setFormData(
        prev => ({
          ...prev,

          temporaryMunicipality:
            value,

          temporaryWard:
            ''
        })
      );
    };


  // =======================================================
  // TABLE COLUMNS
  // =======================================================

  const columns = [
    {
      key: 'studentId',
      label: 'Student ID'
    },

    {
      key: 'iemisCode',
      label: 'IEMIS Code'
    },

    {
      key: 'fullName',
      label: 'Name'
    },

    {
      key: 'currentClass',
      label: 'Class'
    },

    {
      key: 'section',
      label: 'Section'
    },

    {
      key: 'gender',
      label: 'Gender'
    },

    {
      key: 'contactNumber',
      label: 'Contact'
    },

    {
      key: 'status',
      label: 'Status',

      render: (
        value: string
      ) => (
        <Badge
          variant={
            value ===
              'active'
              ? 'success'
              : value ===
                'transferred'
                ? 'warning'
                : 'danger'
          }
        >
          {value}
        </Badge>
      )
    }
  ];


  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="space-y-4">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-3">

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Students Management
          </h2>

          <p className="text-sm text-gray-600">
            Manage student records and information
          </p>
        </div>


        <div className="flex gap-2">

          <Button
            className="text-sm"
            variant="outline"
            icon={
              <Download className="w-5 h-5" />
            }
            onClick={
              downloadSampleTemplate
            }
          >
            Template
          </Button>


          <Button
            className="text-sm"
            variant="outline"
            icon={
              <Upload className="w-5 h-5" />
            }
            onClick={() =>
              setShowImportModal(
                true
              )
            }
          >
            Import
          </Button>


          <Button
            className="text-sm"
            variant="primary"
            icon={
              <Plus className="w-5 h-5" />
            }
            onClick={() => {
              setEditingStudent(
                null
              );

              resetForm();

              setShowModal(
                true
              );
            }}
          >
            Add Student
          </Button>

        </div>
      </div>


      {/* ===================================================
          STUDENTS TABLE
      =================================================== */}

      <DataTable
        data={students}
        columns={columns}
        searchPlaceholder="Search students by name, student ID, IEMIS code..."
        loading={loading}
        actions={(
          student: Student
        ) => (
          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                handleEdit(
                  student
                )
              }
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit student"
            >
              <Edit className="w-4 h-4" />
            </button>


            <button
              type="button"
              onClick={() =>
                handleDelete(
                  student.id
                )
              }
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete student"
            >
              <Trash2 className="w-4 h-4" />
            </button>

          </div>
        )}
      />


      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      <Modal
        isOpen={showModal}
        onClose={() => {
          if (submitting) {
            return;
          }

          setShowModal(
            false
          );

          setEditingStudent(
            null
          );

          resetForm();
        }}
        title={
          editingStudent
            ? 'Edit Student'
            : 'Add Student Information'
        }
        size="xl"
        footer={
          <div className="flex gap-3 justify-end">

            <Button
              variant="outline"
              disabled={
                submitting
              }
              onClick={() => {
                setShowModal(
                  false
                );

                setEditingStudent(
                  null
                );

                resetForm();
              }}
            >
              Cancel
            </Button>


            <Button
              variant="primary"
              disabled={
                submitting
              }
              onClick={() =>
                handleSubmit()
              }
            >
              {submitting
                ? 'Saving...'
                : editingStudent
                  ? 'Update'
                  : 'Add'}
            </Button>

          </div>
        }
      >

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >

          {/* =================================================
              SCHOOL + STUDENT ID + NAMES
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current School
              </label>

              <input
                type="text"
                value={
                  schoolProfile?.schoolName ||
                  ''
                }
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>


            <FormInput
              label="IEMIS Code"
              value={
                schoolProfile?.schoolCode ||
                ''
              }
              disabled
              placeholder="IEMIS Code"
            />


            <FormInput
              label="Student ID"
              value={
                formData.studentId
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    studentId:
                      e.target.value
                  })
                )
              }
              placeholder="Student ID"
            />


            <FormInput
              label="First Name"
              value={
                formData.firstName
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    firstName:
                      e.target.value
                  })
                )
              }
              placeholder="First Name"
            />


            <FormInput
              label="Middle Name"
              value={
                formData.middleName
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    middleName:
                      e.target.value
                  })
                )
              }
              placeholder="Middle Name"
            />

          </div>


          {/* =================================================
              LAST NAME + GENDER + CLASS + SECTION + YEAR
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">

            <FormInput
              label="Last Name"
              value={
                formData.lastName
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    lastName:
                      e.target.value
                  })
                )
              }
              placeholder="Last Name"
            />


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender*
              </label>

              <div className="flex gap-3">

                {[
                  'Male',
                  'Female',
                  'Other'
                ].map(
                  gender => (
                    <label
                      key={
                        gender
                      }
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={
                          gender
                        }
                        checked={
                          formData.gender ===
                          gender
                        }
                        onChange={
                          e =>
                            setFormData(
                              prev => ({
                                ...prev,

                                gender:
                                  e.target.value
                              })
                            )
                        }
                        className="mr-2"
                      />

                      {gender}
                    </label>
                  )
                )}

              </div>
            </div>


            <Select
              label="Current Class"
              required
              value={
                formData.currentClass
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    currentClass:
                      e.target.value
                  })
                )
              }
              options={[
                {
                  value: '',
                  label:
                    'Select Class'
                },

                ...classes.map(
                  classItem => ({
                    value:
                      String(
                        classItem.id
                      ),

                    label:
                      classItem.name
                  })
                )
              ]}
            />


            <FormInput
              label="Section"
              value={
                formData.section
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    section:
                      e.target.value
                  })
                )
              }
              placeholder="Section"
            />


            <FormInput
              label="Admit Year"
              value={
                formData.admitYear
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    admitYear:
                      e.target.value
                  })
                )
              }
              placeholder="2083"
            />

          </div>


          {/* =================================================
              DOB / FOREIGN / CONTACT
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

            <FormInput
              label="Date of Birth"
              type="date"
              value={
                formData.dob
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    dob:
                      e.target.value
                  })
                )
              }
            />


            <FormInput
              label="Nepali Date of Birth"
              type="date"
              value={
                formData.dobNepali
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    dobNepali:
                      e.target.value
                  })
                )
              }
            />


            <div className="flex items-end pb-2">

              <label className="flex items-center text-sm">

                <input
                  type="checkbox"
                  checked={
                    formData.isForeignStudent
                  }
                  onChange={e => {
                    const isForeign =
                      e.target.checked;

                    setFormData(
                      prev => ({
                        ...prev,

                        isForeignStudent:
                          isForeign,

                        ...(isForeign
                          ? {
                            permanentProvince:
                              '',

                            permanentDistrict:
                              '',

                            permanentMunicipality:
                              '',

                            permanentWard:
                              '',

                            permanentTole:
                              '',

                            sameAsPermAddress:
                              false
                          }
                          : {})
                      })
                    );
                  }}
                  className="mr-2"
                />

                Is Foreign Student?

              </label>

            </div>


            <FormInput
              label="Contact Number"
              value={
                formData.contactNumber
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    contactNumber:
                      e.target.value
                  })
                )
              }
              placeholder="Contact Number"
            />

          </div>


          {/* =================================================
              PERMANENT ADDRESS
          ================================================= */}

          {!formData.isForeignStudent && (
            <>
              <div className="border-t pt-4">

                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Permanent Address
                </h3>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">

                <Select
                  label="Province"
                  value={
                    formData.permanentProvince
                  }
                  onChange={e =>
                    handlePermanentProvinceChange(
                      e.target.value
                    )
                  }
                  options={
                    getProvinceOptions()
                  }
                />


                <Select
                  label="District"
                  value={
                    formData.permanentDistrict
                  }
                  onChange={e =>
                    handlePermanentDistrictChange(
                      e.target.value
                    )
                  }
                  options={
                    permanentDistrictOptions
                  }
                  disabled={
                    !formData.permanentProvince
                  }
                />


                <Select
                  label="Municipality"
                  value={
                    formData.permanentMunicipality
                  }
                  onChange={e =>
                    handlePermanentMunicipalityChange(
                      e.target.value
                    )
                  }
                  options={
                    permanentLocalBodyOptions
                  }
                  disabled={
                    !formData.permanentDistrict
                  }
                />


                <Select
                  label="Ward"
                  value={
                    formData.permanentWard
                  }
                  onChange={e =>
                    setFormData(
                      prev => ({
                        ...prev,

                        permanentWard:
                          e.target.value
                      })
                    )
                  }
                  options={
                    permanentWardOptions
                  }
                  disabled={
                    !formData.permanentMunicipality
                  }
                />


                <FormInput
                  label="Tole"
                  value={
                    formData.permanentTole
                  }
                  onChange={e =>
                    setFormData(
                      prev => ({
                        ...prev,

                        permanentTole:
                          e.target.value
                      })
                    )
                  }
                  placeholder="Tole"
                />

              </div>


              <div>

                <label className="flex items-center text-sm">

                  <input
                    type="checkbox"
                    checked={
                      formData.sameAsPermAddress
                    }
                    onChange={e =>
                      handleSameAddressChange(
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />

                  Has Temporary address same as Permanent Address?

                </label>

              </div>
            </>
          )}


          {/* =================================================
              TEMPORARY ADDRESS
          ================================================= */}

          <div className="border-t pt-4">

            <h3 className="text-sm font-semibold text-gray-700 mb-4">

              {formData.isForeignStudent
                ? 'Current Address in Nepal'
                : 'Temporary Address'}

            </h3>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">

            <Select
              label="Province"
              value={
                formData.temporaryProvince
              }
              onChange={e =>
                handleTemporaryProvinceChange(
                  e.target.value
                )
              }
              disabled={
                !formData.isForeignStudent &&
                formData.sameAsPermAddress
              }
              options={
                getProvinceOptions()
              }
            />


            <Select
              label="District"
              value={
                formData.temporaryDistrict
              }
              onChange={e =>
                handleTemporaryDistrictChange(
                  e.target.value
                )
              }
              disabled={
                (
                  !formData.isForeignStudent &&
                  formData.sameAsPermAddress
                ) ||
                !formData.temporaryProvince
              }
              options={
                temporaryDistrictOptions
              }
            />


            <Select
              label="Municipality"
              value={
                formData.temporaryMunicipality
              }
              onChange={e =>
                handleTemporaryMunicipalityChange(
                  e.target.value
                )
              }
              disabled={
                (
                  !formData.isForeignStudent &&
                  formData.sameAsPermAddress
                ) ||
                !formData.temporaryDistrict
              }
              options={
                temporaryLocalBodyOptions
              }
            />


            <Select
              label="Ward"
              value={
                formData.temporaryWard
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    temporaryWard:
                      e.target.value
                  })
                )
              }
              disabled={
                (
                  !formData.isForeignStudent &&
                  formData.sameAsPermAddress
                ) ||
                !formData.temporaryMunicipality
              }
              options={
                temporaryWardOptions
              }
            />


            <FormInput
              label="Tole"
              value={
                formData.temporaryTole
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    temporaryTole:
                      e.target.value
                  })
                )
              }
              placeholder="Tole"
            />

          </div>


          {/* =================================================
              PERSONAL DETAILS
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

            <Select
              label="Mother Tongue"
              value={
                formData.motherTongue
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    motherTongue:
                      e.target.value
                  })
                )
              }
              options={[
                {
                  value: '',
                  label:
                    'Select Mother Tongue'
                },

                {
                  value: 'Nepali',
                  label:
                    'Nepali'
                },

                {
                  value: 'Maithili',
                  label:
                    'Maithili'
                },

                {
                  value: 'Bhojpuri',
                  label:
                    'Bhojpuri'
                },

                {
                  value: 'Tharu',
                  label:
                    'Tharu'
                },

                {
                  value: 'Tamang',
                  label:
                    'Tamang'
                },

                {
                  value: 'Newari',
                  label:
                    'Newari'
                },

                {
                  value: 'Other',
                  label:
                    'Other'
                }
              ]}
            />


            <Select
              label="Disability Type"
              value={
                formData.disabilityType
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    disabilityType:
                      e.target.value
                  })
                )
              }
              options={[
                {
                  value: '',
                  label:
                    'Select Disability'
                },

                {
                  value:
                    'No Disability',
                  label:
                    'No Disability'
                },

                {
                  value:
                    'Physical',
                  label:
                    'Physical'
                },

                {
                  value:
                    'Visual',
                  label:
                    'Visual'
                },

                {
                  value:
                    'Hearing',
                  label:
                    'Hearing'
                },

                {
                  value:
                    'Mental',
                  label:
                    'Mental'
                },

                {
                  value:
                    'Other',
                  label:
                    'Other'
                }
              ]}
            />


            <FormInput
              label="Caste"
              value={
                formData.caste
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    caste:
                      e.target.value
                  })
                )
              }
              placeholder="Caste"
            />


            <FormInput
              label="Blood Group"
              value={
                formData.bloodGroup
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    bloodGroup:
                      e.target.value
                  })
                )
              }
              placeholder="Blood Group"
            />

          </div>


          {/* =================================================
              FAMILY INFORMATION
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

            <FormInput
              label="Father's Name"
              value={
                formData.fatherName
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    fatherName:
                      e.target.value
                  })
                )
              }
              placeholder="Father Name"
            />


            <FormInput
              label="Mother's Name"
              value={
                formData.motherName
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    motherName:
                      e.target.value
                  })
                )
              }
              placeholder="Mother Name"
            />


            <FormInput
              label="Guardian's Name"
              required
              value={
                formData.guardianName
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    guardianName:
                      e.target.value
                  })
                )
              }
              placeholder="Guardian Name"
            />


            <FormInput
              label="Guardian Contact"
              value={
                formData.guardianContactNo
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    guardianContactNo:
                      e.target.value
                  })
                )
              }
              placeholder="Guardian Contact Number"
            />

          </div>


          {/* =================================================
              ADMISSION / TRANSFER
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

            <FormInput
              label="Admission Date"
              type="date"
              value={
                formData.admissionDate
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    admissionDate:
                      e.target.value
                  })
                )
              }
            />


            <label className="flex items-center gap-2 text-sm mt-7">

              <input
                type="checkbox"
                checked={
                  formData.isTransferred
                }
                onChange={e =>
                  setFormData(
                    prev => ({
                      ...prev,

                      isTransferred:
                        e.target.checked,

                      status:
                        e.target.checked
                          ? 'transferred'
                          : 'active'
                    })
                  )
                }
              />

              Is Transferred?

            </label>


            <FormInput
              label="Transferred To School"
              value={
                formData.transferedToSchool
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    transferedToSchool:
                      e.target.value
                  })
                )
              }
              placeholder="School Name"
            />


            <FormInput
              label="Transfer Date"
              type="date"
              value={
                formData.transferDate
              }
              onChange={e =>
                setFormData(
                  prev => ({
                    ...prev,

                    transferDate:
                      e.target.value
                  })
                )
              }
            />

          </div>


          {/* =================================================
              PHOTO
          ================================================= */}

          <div className="text-sm">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo
            </label>


            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />


            <p className="mt-1 text-xs text-red-500 italic">
              Only image files not more than 2MB are allowed.
            </p>


            {imagePreview && (
              <img
                src={
                  imagePreview
                }
                alt="Student preview"
                className="mt-2 w-24 h-24 rounded object-cover border-2 border-gray-200"
              />
            )}

          </div>

        </form>

      </Modal>


      {/* ===================================================
          IMPORT MODAL
      =================================================== */}

      <Modal
        isOpen={
          showImportModal
        }
        onClose={() => {
          if (
            loading
          ) {
            return;
          }

          setShowImportModal(
            false
          );

          resetImportState();
        }}
        title="Import Students from Excel"
        size="lg"
        footer=""
      >

        <div className="space-y-4">

          {/* =================================================
              INSTRUCTIONS
          ================================================= */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

            <h4 className="font-semibold text-blue-900 mb-2">
              📋 Instructions
            </h4>


            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">

              <li>
                Download the Excel template first.
              </li>

              <li>
                Fill in the student data following the column headers.
              </li>

              <li>
                The <strong>S.N</strong> column is ignored and is not stored.
              </li>

              <li>
                Current School and IEMIS Code are automatically taken from the school profile.
              </li>

              <li>
                Full Name, Current Class and Guardian Name are required.
              </li>

              <li>
                Rows with validation errors will not be imported.
              </li>

              <li>
                Review the preview before importing.
              </li>

            </ul>

          </div>


          {/* =================================================
              FILE
          ================================================= */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Excel File
            </label>


            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={
                handleImportFileChange
              }
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />


            {importFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file:{' '}
                <strong>
                  {
                    importFile.name
                  }
                </strong>
              </p>
            )}

          </div>


          {/* =================================================
              VALIDATION
          ================================================= */}

          {validationErrors.length >
            0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-60 overflow-y-auto">

                <h4 className="font-semibold text-yellow-900 mb-2">
                  ⚠️ Validation Warnings (
                  {
                    validationErrors.length
                  }
                  )
                </h4>


                <p className="text-xs text-yellow-700 mb-2">
                  These rows are excluded from import. Correct the Excel file and upload it again.
                </p>


                <ul className="text-sm text-yellow-800 space-y-1">

                  {validationErrors.map(
                    (
                      error,
                      index
                    ) => (
                      <li
                        key={
                          index
                        }
                        className="flex items-start gap-2"
                      >
                        <span className="text-yellow-600 mt-0.5">
                          •
                        </span>

                        <span>
                          {
                            error
                          }
                        </span>
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}


          {/* =================================================
              PREVIEW
          ================================================= */}

          {importData.length >
            0 && (
              <div className="border border-gray-200 rounded-lg p-4">

                <h4 className="font-semibold text-gray-900 mb-3">

                  📊 Valid Preview (
                  {
                    importData.length
                  }{' '}
                  records)

                </h4>


                <div className="max-h-60 overflow-auto">

                  <table className="min-w-full divide-y divide-gray-200 text-sm">

                    <thead className="bg-gray-50 sticky top-0">

                      <tr>

                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          #
                        </th>

                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Student ID
                        </th>

                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>

                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Class
                        </th>

                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Gender
                        </th>

                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Guardian
                        </th>

                      </tr>

                    </thead>


                    <tbody className="bg-white divide-y divide-gray-200">

                      {importData
                        .slice(
                          0,
                          10
                        )
                        .map(
                          (
                            row,
                            index
                          ) => (
                            <tr
                              key={
                                index
                              }
                              className={
                                index %
                                  2 ===
                                  0
                                  ? 'bg-white'
                                  : 'bg-gray-50'
                              }
                            >

                              <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                                {
                                  index +
                                  1
                                }
                              </td>


                              <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                                {
                                  row.studentId ||
                                  '-'
                                }
                              </td>


                              <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                                {
                                  row.fullName
                                }
                              </td>


                              <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                                {
                                  row.currentClass ||
                                  '-'
                                }
                              </td>


                              <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                                {
                                  row.gender ||
                                  '-'
                                }
                              </td>


                              <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                                {
                                  row.guardianName ||
                                  '-'
                                }
                              </td>

                            </tr>
                          )
                        )}

                    </tbody>

                  </table>


                  {importData.length >
                    10 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Showing first 10 of{' '}
                        {
                          importData.length
                        }{' '}
                        valid records
                      </p>
                    )}

                </div>

              </div>
            )}


          {/* =================================================
              IMPORT BUTTONS
          ================================================= */}

          <div className="flex gap-3 justify-end pt-4 border-t">

            <Button
              variant="outline"
              disabled={
                loading
              }
              onClick={() => {
                setShowImportModal(
                  false
                );

                resetImportState();
              }}
            >
              Cancel
            </Button>


            <Button
              variant="primary"
              onClick={
                handleImportConfirm
              }
              disabled={
                importData.length ===
                0 ||
                validationErrors.length >
                0 ||
                loading
              }
            >
              {loading
                ? 'Importing...'
                : `Import ${importData.length} Student(s)`}
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  );
};


export default Students;