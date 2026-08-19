const { students } = require('../database/connection');
const {
    uploadToSupabase,
    deleteFromSupabase
} = require('../config/supabase');

/**
 * Build permanent address from individual address fields.
 *
 * Example:
 * Municipality - 1, Dang, Tole
 */
const buildPermanentAddress = ({
    permanentMunicipality,
    permanentWard,
    permanentDistrict,
    permanentTole,
}) => {
    return [
        permanentMunicipality
            ? `${permanentMunicipality}${permanentWard ? ` - ${permanentWard}` : ''}`
            : permanentWard || null,
        permanentDistrict,
        permanentTole,
    ]
        .filter(Boolean)
        .join(', ');
};

/**
 * Build temporary address from individual address fields.
 */
const buildTemporaryAddress = ({
    temporaryMunicipality,
    temporaryWard,
    temporaryDistrict,
    temporaryTole,
}) => {
    return [
        temporaryMunicipality
            ? `${temporaryMunicipality}${temporaryWard ? ` - ${temporaryWard}` : ''}`
            : temporaryWard || null,
        temporaryDistrict,
        temporaryTole,
    ]
        .filter(Boolean)
        .join(', ');
};

/**
 * Build full student name.
 *
 * The frontend sends firstName, middleName and lastName
 * separately for both manual entry and Excel import.
 *
 * The controller only combines them for database storage.
 */
const buildFullName = (firstName, middleName, lastName) => {
    return [
        firstName,
        middleName,
        lastName,
    ]
        .filter(Boolean)
        .join(' ')
        .trim();
};

/**
 * Convert Excel/string boolean values to boolean.
 *
 * Supports:
 * Yes / No
 * True / False
 * 1 / 0
 * Y / N
 */
const parseBoolean = (value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (value === null || value === undefined) {
        return false;
    }

    const normalized = String(value)
        .trim()
        .toLowerCase();

    return ['yes', 'true', '1', 'y'].includes(normalized);
};


// ============================================================
// CREATE STUDENT
// ============================================================

exports.createStudent = async (req, res) => {
    try {
        const {
            // ======================================================
            // Basic Information
            // ======================================================
            iemisCode,
            studentId,
            currentSchool,

            firstName,
            middleName,
            lastName,

            email,
            contactNumber,
            dob,
            dobNepali,
            gender,
            isForeignStudent,

            // ======================================================
            // Permanent Address
            // ======================================================
            permanentAddress,
            permanentProvince,
            permanentDistrict,
            permanentMunicipality,
            permanentWard,
            permanentTole,

            // ======================================================
            // Temporary Address
            // ======================================================
            temporaryAddress,
            temporaryProvince,
            temporaryDistrict,
            temporaryMunicipality,
            temporaryWard,
            temporaryTole,
            sameAsPermAddress,

            // ======================================================
            // Family Information
            // ======================================================
            fatherName,
            motherName,
            guardianName,
            guardianPhone,
            guardianContactNo,
            guardianEmail,

            // ======================================================
            // Academic Information
            // ======================================================
            currentClass,
            section,
            rollNumber,
            admitYear,
            admissionDate,
            admissionDateNepali,
            previousSchool,
            previousGrade,
            previousPercentage,
            subject,

            // ======================================================
            // Personal Details
            // ======================================================
            caste,
            motherTongue,
            disabilityType,
            bloodGroup,

            // ======================================================
            // School Information
            // ======================================================
            schoolingSource,
            scholarship,
            currentScholarship,

            // ======================================================
            // Status
            // ======================================================
            status,

            // ======================================================
            // Transfer Information
            // ======================================================
            isTransferred,
            transferedToSchool,
            transferDate,

            // ======================================================
            // Media / Additional
            // ======================================================
            profileImage,
            photo,
            medicalInfo,
            notes,

            // ======================================================
            // Legacy address
            // ======================================================
            address,
        } = req.body;


        // ========================================================
        // VALIDATION
        // ========================================================

        if (!firstName || !lastName || !currentClass) {
            return res.status(400).json({
                message: 'First name, last name, and current class are required',
            });
        }

        if (!iemisCode) {
            return res.status(400).json({
                message: 'IEMIS code is required',
            });
        }

        if (!studentId) {
            return res.status(400).json({
                message: 'Student ID is required',
            });
        }

        if (!currentSchool) {
            return res.status(400).json({
                message: 'Current school is required',
            });
        }
        // ========================================================
        // BUILD FULL NAME
        // ========================================================

        const fullName = buildFullName(
            firstName,
            middleName,
            lastName
        );
        // ========================================================
        // BUILD PERMANENT ADDRESS
        // ========================================================

        const finalPermanentAddress =
            buildPermanentAddress({
                permanentMunicipality,
                permanentWard,
                permanentDistrict,
                permanentTole,
            }) || permanentAddress || null;
        // ========================================================
        // BUILD TEMPORARY ADDRESS
        // ========================================================

        const finalTemporaryAddress =
            buildTemporaryAddress({
                temporaryMunicipality,
                temporaryWard,
                temporaryDistrict,
                temporaryTole,
            }) || temporaryAddress || null;
        // ========================================================
        // HANDLE PHOTO UPLOAD
        // ========================================================

        let photoUrl = photo || null;

        if (req.file) {
            try {
                const uploadResult = await uploadToSupabase(
                    req.file.buffer,
                    req.file.originalname,
                    'student-images',
                    req.file.mimetype
                );

                photoUrl = uploadResult.url;
            } catch (uploadError) {
                console.error(
                    'Error uploading student photo:',
                    uploadError
                );
            }
        }
        // ========================================================
        // TRANSFER STATUS
        // ========================================================

        const transferred = parseBoolean(isTransferred);
        // ========================================================
        // CREATE STUDENT
        // ========================================================

        const newStudent = await students.create({
            // ------------------------------------------------------
            // Basic Information
            // ------------------------------------------------------
            iemisCode,
            studentId,
            currentSchool,

            firstName,
            middleName: middleName || null,
            lastName,
            fullName,

            email: email || null,
            contactNumber: contactNumber || null,

            dob: dob || null,
            dobNepali: dobNepali || null,

            gender: gender || null,
            isForeignStudent: parseBoolean(isForeignStudent),


            // ------------------------------------------------------
            // Permanent Address
            // ------------------------------------------------------

            permanentAddress: finalPermanentAddress,

            permanentProvince: permanentProvince || null,
            permanentDistrict: permanentDistrict || null,
            permanentMunicipality: permanentMunicipality || null,
            permanentWard: permanentWard || null,
            permanentTole: permanentTole || null,


            // ------------------------------------------------------
            // Temporary Address
            // ------------------------------------------------------

            temporaryAddress: finalTemporaryAddress,

            temporaryProvince: temporaryProvince || null,
            temporaryDistrict: temporaryDistrict || null,
            temporaryMunicipality: temporaryMunicipality || null,
            temporaryWard: temporaryWard || null,
            temporaryTole: temporaryTole || null,

            sameAsPermAddress: parseBoolean(sameAsPermAddress),


            // ------------------------------------------------------
            // Legacy Address
            // ------------------------------------------------------

            address: address || null,


            // ------------------------------------------------------
            // Family Information
            // ------------------------------------------------------

            fatherName: fatherName || null,
            motherName: motherName || null,

            guardianName: guardianName || null,
            guardianPhone: guardianPhone || null,
            guardianContactNo: guardianContactNo || null,
            guardianEmail: guardianEmail || null,


            // ------------------------------------------------------
            // Academic Information
            // ------------------------------------------------------

            currentClass,
            section: section || null,
            rollNumber: rollNumber || null,

            admitYear: admitYear || null,
            admissionDate: admissionDate || null,
            admissionDateNepali: admissionDateNepali || null,

            previousSchool: previousSchool || null,
            previousGrade: previousGrade || null,
            previousPercentage: previousPercentage || null,

            subject: subject || null,


            // ------------------------------------------------------
            // Personal Details
            // ------------------------------------------------------

            caste: caste || null,
            motherTongue: motherTongue || null,
            disabilityType: disabilityType || null,
            bloodGroup: bloodGroup || null,


            // ------------------------------------------------------
            // School Information
            // ------------------------------------------------------

            schoolingSource: schoolingSource || null,
            scholarship: scholarship || null,
            currentScholarship: currentScholarship || null,


            // ------------------------------------------------------
            // Status
            // ------------------------------------------------------

            status: transferred
                ? 'transferred'
                : (status || 'active'),


            // ------------------------------------------------------
            // Media
            // ------------------------------------------------------

            profileImage: profileImage || null,
            photo: photoUrl,


            // ------------------------------------------------------
            // Transfer Information
            // ------------------------------------------------------

            isTransferred: transferred,
            transferedToSchool: transferedToSchool || null,
            transferDate: transferDate || null,


            // ------------------------------------------------------
            // Additional
            // ------------------------------------------------------

            medicalInfo: medicalInfo || null,
            notes: notes || null,
        });


        // ========================================================
        // RESPONSE
        // ========================================================

        return res.status(201).json({
            message: 'Student created successfully',
            data: newStudent,
        });

    } catch (error) {
        console.error('Error creating student:', error);

        return res.status(500).json({
            message: 'Error creating student',
            error: error.message,
        });
    }
};


// ============================================================
// FETCH ALL STUDENTS
// ============================================================

// exports.fetchStudents = async (req, res) => {
//     try {
//         const {
//             class: className,
//             currentClass,
//             section,
//             search,
//             status,
//         } = req.query;

//         const whereClause = {};


//         // ========================================================
//         // CLASS FILTER
//         // ========================================================

//         const selectedClass = currentClass || className;

//         if (selectedClass) {
//             whereClause.currentClass = selectedClass;
//         }


//         // ========================================================
//         // SECTION FILTER
//         // ========================================================

//         if (section) {
//             whereClause.section = section;
//         }


//         // ========================================================
//         // STATUS FILTER
//         // ========================================================

//         if (status) {
//             whereClause.status = status;
//         }


//         // ========================================================
//         // SEARCH
//         // ========================================================

//         if (search) {
//             const { Op } = require('sequelize');

//             whereClause[Op.or] = [
//                 {
//                     firstName: {
//                         [Op.iLike]: `%${search}%`,
//                     },
//                 },
//                 {
//                     middleName: {
//                         [Op.iLike]: `%${search}%`,
//                     },
//                 },
//                 {
//                     lastName: {
//                         [Op.iLike]: `%${search}%`,
//                     },
//                 },
//                 {
//                     fullName: {
//                         [Op.iLike]: `%${search}%`,
//                     },
//                 },
//                 {
//                     studentId: {
//                         [Op.iLike]: `%${search}%`,
//                     },
//                 },
//                 {
//                     iemisCode: {
//                         [Op.iLike]: `%${search}%`,
//                     },
//                 },
//                 {
//                     rollNumber: {
//                         [Op.iLike]: `%${search}%`,
//                     },
//                 },
//             ];
//         }


//         // ========================================================
//         // FETCH
//         // ========================================================

//         const allStudents = await students.findAll({
//             where: whereClause,
//             order: [['createdAt', 'DESC']],
//         });


//         return res.json({
//             message: 'Students fetched successfully',
//             data: allStudents,
//         });

//     } catch (error) {
//         console.error('Error fetching students:', error);

//         return res.status(500).json({
//             message: 'Error fetching students',
//             error: error.message,
//         });
//     }
// };
exports.fetchStudents = async (req, res) => {
    try {
        const {
            currentClass,
            section,
            search,
            status,
        } = req.query;

        const whereClause = {};

        // ========================================================
        // CURRENT CLASS FILTER
        // Value should be: 1, 2, 3, ... 10
        // ========================================================

        if (currentClass) {
            whereClause.currentClass = currentClass;
        }

        // ========================================================
        // SECTION FILTER
        // ========================================================

        if (section) {
            whereClause.section = section;
        }

        // ========================================================
        // STATUS FILTER
        // ========================================================

        if (status) {
            whereClause.status = status;
        }

        // ========================================================
        // SEARCH
        // ========================================================

        if (search) {
            const { Op } = require('sequelize');

            whereClause[Op.or] = [
                {
                    firstName: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    middleName: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    lastName: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    fullName: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    studentId: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    iemisCode: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    rollNumber: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
            ];
        }

        // ========================================================
        // FETCH STUDENTS
        // ========================================================

        const allStudents = await students.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });

        return res.json({
            message: 'Students fetched successfully',
            data: allStudents,
        });

    } catch (error) {
        console.error('Error fetching students:', error);

        return res.status(500).json({
            message: 'Error fetching students',
            error: error.message,
        });
    }
};
// ============================================================
// FETCH SINGLE STUDENT
// ============================================================

exports.fetchSingleStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await students.findByPk(id);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }

        return res.json({
            message: 'Student details',
            data: student,
        });

    } catch (error) {
        console.error('Error fetching student:', error);

        return res.status(500).json({
            message: 'Error fetching student',
            error: error.message,
        });
    }
};


// ============================================================
// UPDATE STUDENT
// ============================================================

exports.updateStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await students.findByPk(id);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }


        const {
            // Basic Information
            iemisCode,
            studentId,
            currentSchool,

            firstName,
            middleName,
            lastName,

            email,
            contactNumber,
            dob,
            dobNepali,
            gender,
            isForeignStudent,

            // Permanent Address
            permanentAddress,
            permanentProvince,
            permanentDistrict,
            permanentMunicipality,
            permanentWard,
            permanentTole,

            // Temporary Address
            temporaryAddress,
            temporaryProvince,
            temporaryDistrict,
            temporaryMunicipality,
            temporaryWard,
            temporaryTole,
            sameAsPermAddress,

            // Family Information
            fatherName,
            motherName,
            guardianName,
            guardianPhone,
            guardianContactNo,
            guardianEmail,

            // Academic Information
            currentClass,
            section,
            rollNumber,
            admitYear,
            admissionDate,
            admissionDateNepali,
            previousSchool,
            previousGrade,
            previousPercentage,
            subject,

            // Personal Details
            caste,
            motherTongue,
            disabilityType,
            bloodGroup,

            // School Information
            schoolingSource,
            scholarship,
            currentScholarship,

            // Status
            status,

            // Transfer Information
            isTransferred,
            transferedToSchool,
            transferDate,

            // Media
            profileImage,
            photo,

            // Additional
            medicalInfo,
            notes,

            // Legacy
            address,
        } = req.body;


        // ========================================================
        // UPDATED BASIC INFORMATION
        // ========================================================

        const updatedFirstName =
            firstName !== undefined
                ? firstName
                : student.firstName;

        const updatedMiddleName =
            middleName !== undefined
                ? middleName
                : student.middleName;

        const updatedLastName =
            lastName !== undefined
                ? lastName
                : student.lastName;

        const fullName = buildFullName(
            updatedFirstName,
            updatedMiddleName,
            updatedLastName
        );


        // ========================================================
        // UPDATED PERMANENT ADDRESS
        // ========================================================

        const finalPermanentProvince =
            permanentProvince !== undefined
                ? permanentProvince
                : student.permanentProvince;

        const finalPermanentDistrict =
            permanentDistrict !== undefined
                ? permanentDistrict
                : student.permanentDistrict;

        const finalPermanentMunicipality =
            permanentMunicipality !== undefined
                ? permanentMunicipality
                : student.permanentMunicipality;

        const finalPermanentWard =
            permanentWard !== undefined
                ? permanentWard
                : student.permanentWard;

        const finalPermanentTole =
            permanentTole !== undefined
                ? permanentTole
                : student.permanentTole;

        const finalPermanentAddress =
            buildPermanentAddress({
                permanentMunicipality: finalPermanentMunicipality,
                permanentWard: finalPermanentWard,
                permanentDistrict: finalPermanentDistrict,
                permanentTole: finalPermanentTole,
            }) ||
            permanentAddress ||
            student.permanentAddress ||
            null;


        // ========================================================
        // UPDATED TEMPORARY ADDRESS
        // ========================================================

        const finalTemporaryProvince =
            temporaryProvince !== undefined
                ? temporaryProvince
                : student.temporaryProvince;

        const finalTemporaryDistrict =
            temporaryDistrict !== undefined
                ? temporaryDistrict
                : student.temporaryDistrict;

        const finalTemporaryMunicipality =
            temporaryMunicipality !== undefined
                ? temporaryMunicipality
                : student.temporaryMunicipality;

        const finalTemporaryWard =
            temporaryWard !== undefined
                ? temporaryWard
                : student.temporaryWard;

        const finalTemporaryTole =
            temporaryTole !== undefined
                ? temporaryTole
                : student.temporaryTole;

        const finalTemporaryAddress =
            buildTemporaryAddress({
                temporaryMunicipality: finalTemporaryMunicipality,
                temporaryWard: finalTemporaryWard,
                temporaryDistrict: finalTemporaryDistrict,
                temporaryTole: finalTemporaryTole,
            }) ||
            temporaryAddress ||
            student.temporaryAddress ||
            null;


        // ========================================================
        // TRANSFER STATUS
        // ========================================================

        const transferred =
            isTransferred !== undefined
                ? parseBoolean(isTransferred)
                : Boolean(student.isTransferred);


        // ========================================================
        // HANDLE PHOTO
        // ========================================================

        let photoUrl =
            photo !== undefined
                ? photo
                : student.photo;


        if (req.file) {
            try {
                // Delete old photo
                if (student.photo) {
                    await deleteFromSupabase(
                        student.photo,
                        'student-images'
                    );
                }


                // Upload new photo
                const uploadResult = await uploadToSupabase(
                    req.file.buffer,
                    req.file.originalname,
                    'student-images',
                    req.file.mimetype
                );

                photoUrl = uploadResult.url;

            } catch (uploadError) {
                console.error(
                    'Error uploading student photo:',
                    uploadError
                );

                photoUrl = student.photo;
            }
        }


        // ========================================================
        // UPDATE STUDENT
        // ========================================================

        await student.update({

            // ------------------------------------------------------
            // Basic Information
            // ------------------------------------------------------

            iemisCode:
                iemisCode !== undefined
                    ? iemisCode
                    : student.iemisCode,

            studentId:
                studentId !== undefined
                    ? studentId
                    : student.studentId,

            currentSchool:
                currentSchool !== undefined
                    ? currentSchool
                    : student.currentSchool,

            firstName: updatedFirstName,
            middleName: updatedMiddleName,
            lastName: updatedLastName,
            fullName,

            email:
                email !== undefined
                    ? email
                    : student.email,

            contactNumber:
                contactNumber !== undefined
                    ? contactNumber
                    : student.contactNumber,

            dob:
                dob !== undefined
                    ? dob
                    : student.dob,

            dobNepali:
                dobNepali !== undefined
                    ? dobNepali
                    : student.dobNepali,

            gender:
                gender !== undefined
                    ? gender
                    : student.gender,

            isForeignStudent:
                isForeignStudent !== undefined
                    ? parseBoolean(isForeignStudent)
                    : student.isForeignStudent,


            // ------------------------------------------------------
            // Permanent Address
            // ------------------------------------------------------

            permanentAddress: finalPermanentAddress,
            permanentProvince: finalPermanentProvince,
            permanentDistrict: finalPermanentDistrict,
            permanentMunicipality: finalPermanentMunicipality,
            permanentWard: finalPermanentWard,
            permanentTole: finalPermanentTole,


            // ------------------------------------------------------
            // Temporary Address
            // ------------------------------------------------------

            temporaryAddress: finalTemporaryAddress,
            temporaryProvince: finalTemporaryProvince,
            temporaryDistrict: finalTemporaryDistrict,
            temporaryMunicipality: finalTemporaryMunicipality,
            temporaryWard: finalTemporaryWard,
            temporaryTole: finalTemporaryTole,

            sameAsPermAddress:
                sameAsPermAddress !== undefined
                    ? parseBoolean(sameAsPermAddress)
                    : student.sameAsPermAddress,


            // ------------------------------------------------------
            // Legacy Address
            // ------------------------------------------------------

            address:
                address !== undefined
                    ? address
                    : student.address,


            // ------------------------------------------------------
            // Family Information
            // ------------------------------------------------------

            fatherName:
                fatherName !== undefined
                    ? fatherName
                    : student.fatherName,

            motherName:
                motherName !== undefined
                    ? motherName
                    : student.motherName,

            guardianName:
                guardianName !== undefined
                    ? guardianName
                    : student.guardianName,

            guardianPhone:
                guardianPhone !== undefined
                    ? guardianPhone
                    : student.guardianPhone,

            guardianContactNo:
                guardianContactNo !== undefined
                    ? guardianContactNo
                    : student.guardianContactNo,

            guardianEmail:
                guardianEmail !== undefined
                    ? guardianEmail
                    : student.guardianEmail,


            // ------------------------------------------------------
            // Academic Information
            // ------------------------------------------------------

            currentClass:
                currentClass !== undefined
                    ? currentClass
                    : student.currentClass,

            section:
                section !== undefined
                    ? section
                    : student.section,

            rollNumber:
                rollNumber !== undefined
                    ? rollNumber
                    : student.rollNumber,

            admitYear:
                admitYear !== undefined
                    ? admitYear
                    : student.admitYear,

            admissionDate:
                admissionDate !== undefined
                    ? admissionDate
                    : student.admissionDate,

            admissionDateNepali:
                admissionDateNepali !== undefined
                    ? admissionDateNepali
                    : student.admissionDateNepali,

            previousSchool:
                previousSchool !== undefined
                    ? previousSchool
                    : student.previousSchool,

            previousGrade:
                previousGrade !== undefined
                    ? previousGrade
                    : student.previousGrade,

            previousPercentage:
                previousPercentage !== undefined
                    ? previousPercentage
                    : student.previousPercentage,

            subject:
                subject !== undefined
                    ? subject
                    : student.subject,


            // ------------------------------------------------------
            // Personal Details
            // ------------------------------------------------------

            caste:
                caste !== undefined
                    ? caste
                    : student.caste,

            motherTongue:
                motherTongue !== undefined
                    ? motherTongue
                    : student.motherTongue,

            disabilityType:
                disabilityType !== undefined
                    ? disabilityType
                    : student.disabilityType,

            bloodGroup:
                bloodGroup !== undefined
                    ? bloodGroup
                    : student.bloodGroup,


            // ------------------------------------------------------
            // School Information
            // ------------------------------------------------------

            schoolingSource:
                schoolingSource !== undefined
                    ? schoolingSource
                    : student.schoolingSource,

            scholarship:
                scholarship !== undefined
                    ? scholarship
                    : student.scholarship,

            currentScholarship:
                currentScholarship !== undefined
                    ? currentScholarship
                    : student.currentScholarship,


            // ------------------------------------------------------
            // Status
            // ------------------------------------------------------

            status: transferred
                ? 'transferred'
                : (
                    status !== undefined
                        ? status
                        : student.status
                ),


            // ------------------------------------------------------
            // Media
            // ------------------------------------------------------

            profileImage:
                profileImage !== undefined
                    ? profileImage
                    : student.profileImage,

            photo: photoUrl,


            // ------------------------------------------------------
            // Transfer Information
            // ------------------------------------------------------

            isTransferred: transferred,

            transferedToSchool:
                transferedToSchool !== undefined
                    ? transferedToSchool
                    : student.transferedToSchool,

            transferDate:
                transferDate !== undefined
                    ? transferDate
                    : student.transferDate,


            // ------------------------------------------------------
            // Additional
            // ------------------------------------------------------

            medicalInfo:
                medicalInfo !== undefined
                    ? medicalInfo
                    : student.medicalInfo,

            notes:
                notes !== undefined
                    ? notes
                    : student.notes,
        });


        return res.json({
            message: 'Student updated successfully',
            data: student,
        });

    } catch (error) {
        console.error('Error updating student:', error);

        return res.status(500).json({
            message: 'Error updating student',
            error: error.message,
        });
    }
};


// ============================================================
// DELETE STUDENT
// ============================================================

exports.deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await students.findByPk(id);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }


        // Delete student photo if it exists
        if (student.photo) {
            try {
                await deleteFromSupabase(
                    student.photo,
                    'student-images'
                );
            } catch (photoError) {
                console.error(
                    'Error deleting student photo:',
                    photoError
                );
            }
        }


        await students.destroy({
            where: { id },
        });


        return res.json({
            message: 'Student deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting student:', error);

        return res.status(500).json({
            message: 'Error deleting student',
            error: error.message,
        });
    }
};


// ============================================================
// GET STUDENTS BY CLASS
// ============================================================

exports.fetchStudentsByClass = async (req, res) => {
    const { className } = req.params;

    try {
        const classStudents = await students.findAll({
            where: {
                currentClass: className,
            },
            order: [
                ['rollNumber', 'ASC'],
            ],
        });


        return res.json({
            message: `Students in class ${className}`,
            data: classStudents,
        });

    } catch (error) {
        console.error(
            'Error fetching students by class:',
            error
        );

        return res.status(500).json({
            message: 'Error fetching students by class',
            error: error.message,
        });
    }
};


// ============================================================
// GET STUDENTS BY STATUS
// ============================================================

exports.fetchStudentsByStatus = async (req, res) => {
    const { status } = req.params;

    try {
        const statusStudents = await students.findAll({
            where: {
                status,
            },
            order: [['createdAt', 'DESC']],
        });

        return res.json({
            message: `Students with status ${status}`,
            data: statusStudents,
        });

    } catch (error) {
        console.error('Error fetching students by status:', error);

        return res.status(500).json({
            message: 'Error fetching students by status',
            error: error.message,
        });
    }
};