const { feeAllocations, feeStructures, feeStructureItems, feeCategories, students, feeTransactions,
} = require('../database/connection');
const { Op } = require('sequelize');

// Allocate fee structure to a single student
exports.allocateFeeToStudent = async (req, res) => {
  try {
    const {
      studentId,
      feeStructureId,
      discount,
      discountReason,
      dueDate,
      allocationBatch,
      purpose,
    } = req.body;

    if (!studentId || !feeStructureId) {
      return res.status(400).json({
        message: 'Student ID and Fee Structure ID are required',
      });
    }

    const [student, feeStructure] = await Promise.all([
      students.findByPk(studentId),
      feeStructures.findByPk(feeStructureId),
    ]);

    if (!student) {
      return res.status(404).json({
        message: 'Student not found',
      });
    }

    if (!feeStructure) {
      return res.status(404).json({
        message: 'Fee structure not found',
      });
    }

    const normalizedStudentClass = String(student.currentClass || '').trim().toLowerCase();
    const normalizedStructureClass = String(feeStructure.class || '').trim().toLowerCase();

    if (normalizedStructureClass && normalizedStudentClass !== normalizedStructureClass) {
      return res.status(400).json({
        message: 'Selected fee structure class does not match student current class',
        code: 'FEE_STRUCTURE_CLASS_MISMATCH',
        data: {
          studentId: student.id,
          studentClass: student.currentClass,
          feeStructureClass: feeStructure.class,
        },
      });
    }

    const discountAmount = parseFloat(discount) || 0;
    if (discountAmount < 0) {
      return res.status(400).json({
        message: 'Discount cannot be negative',
      });
    }

    const whereClause = {
      studentId,
      feeStructureId,
    };

    if (allocationBatch && allocationBatch.trim()) {
      whereClause.allocationBatch = allocationBatch.trim();
    }

    const existingAllocation = await feeAllocations.findOne({
      where: whereClause,
    });

    if (existingAllocation) {
      return res.status(409).json({
        message: 'Fee already allocated for this student and batch',
        code: 'FEE_ALREADY_ALLOCATED',
      });
    }

    const totalAmount = parseFloat(feeStructure.totalAmount);
    const balance = totalAmount - discountAmount;

    const allocation = await feeAllocations.create({
      studentId,
      feeStructureId,
      totalAmount,
      paidAmount: 0,
      balance,
      status: 'pending',
      discount: discountAmount,
      discountReason: discountReason?.trim() || null,
      dueDate: dueDate || feeStructure.dueDate,
      allocationDate: new Date(),
      allocationBatch: allocationBatch?.trim() || null,
      purpose: purpose || 'tuition',
      allocatedBy: req.user?.id || null,
    });

    return res.status(201).json({
      message: 'Fee allocated successfully',
      data: allocation,
    });
  } catch (error) {
    console.error('Error allocating fee to student:', error);

    return res.status(500).json({
      message: 'Error allocating fee to student',
      error: error.message,
    });
  }
};

// Allocate fee structure to all students in a class
exports.allocateFeeToClass = async (req, res) => {
  try {
    const {
      className,
      class: legacyClassName,
      section,
      feeStructureId,
      discount,
      discountReason,
      dueDate,
      allocationBatch,
      purpose,
    } = req.body;

    // Support both:
    // { className: "1" }
    // and legacy:
    // { class: "1" }
    const selectedClass = className || legacyClassName;

    // --------------------------------------------------
    // 1. Validate request
    // --------------------------------------------------
    if (!selectedClass || !feeStructureId) {
      return res.status(400).json({
        message: 'Class and Fee Structure ID are required',
      });
    }

    // --------------------------------------------------
    // 2. Validate fee structure
    // --------------------------------------------------
    const feeStructure = await feeStructures.findByPk(feeStructureId);

    if (!feeStructure) {
      return res.status(404).json({
        message: 'Fee structure not found',
      });
    }

    const normalizedSelectedClass = String(selectedClass).trim().toLowerCase();
    const normalizedStructureClass = String(feeStructure.class || '').trim().toLowerCase();

    if (normalizedStructureClass && normalizedSelectedClass !== normalizedStructureClass) {
      return res.status(400).json({
        message: 'Selected fee structure class does not match requested class',
        code: 'FEE_STRUCTURE_CLASS_MISMATCH',
        data: {
          selectedClass,
          feeStructureClass: feeStructure.class,
        },
      });
    }

    // --------------------------------------------------
    // 3. Find students using students.currentClass
    // --------------------------------------------------
    const studentWhere = {
      currentClass: String(selectedClass),
    };

    if (section && section.trim()) {
      studentWhere.section = section.trim();
    }

    const studentsInClass = await students.findAll({
      where: studentWhere,
      attributes: ['id', 'fullName', 'currentClass', 'section'],
    });

    if (studentsInClass.length === 0) {
      return res.status(404).json({
        message: `No students found in class ${selectedClass}`,
      });
    }

    const studentIds = studentsInClass.map((student) => student.id);

    // --------------------------------------------------
    // 4. IMPORTANT:
    // Prevent the same fee structure from being
    // allocated to the same class more than once.
    //
    // We check ALL students in the selected class.
    // --------------------------------------------------
    const existingAllocations = await feeAllocations.findAll({
      where: {
        studentId: {
          [Op.in]: studentIds,
        },
        feeStructureId,
      },
      attributes: ['id', 'studentId', 'feeStructureId'],
      include: [
        {
          model: students,
          as: 'student',
          attributes: ['id', 'fullName', 'currentClass', 'section'],
        },
      ],
    });

    if (existingAllocations.length > 0) {
      return res.status(409).json({
        message: `This fee structure has already been allocated to class ${selectedClass}.`,
        code: 'FEE_ALREADY_ALLOCATED_TO_CLASS',
        data: {
          className: selectedClass,
          feeStructureId,
          alreadyAllocatedCount: existingAllocations.length,
          totalStudents: studentsInClass.length,
        },
      });
    }

    // --------------------------------------------------
    // 5. Allocate to all students
    // --------------------------------------------------
    const discountAmount = parseFloat(discount) || 0;

    if (discountAmount < 0) {
      return res.status(400).json({
        message: 'Discount cannot be negative',
      });
    }

    const totalAmount = parseFloat(feeStructure.totalAmount);
    const balance = totalAmount - discountAmount;

    const allocations = [];
    const errors = [];

    for (const student of studentsInClass) {
      try {
        const allocation = await feeAllocations.create({
          studentId: student.id,
          feeStructureId,
          totalAmount,
          paidAmount: 0,
          balance,
          status: 'pending',
          discount: discountAmount,
          discountReason: discountReason?.trim() || null,
          dueDate: dueDate || feeStructure.dueDate,
          allocationDate: new Date(),
          allocationBatch: allocationBatch?.trim() || null,
          purpose: purpose || 'tuition',
          allocatedBy: req.user?.id || null,
        });

        allocations.push(allocation);
      } catch (error) {
        errors.push({
          studentId: student.id,
          studentName: student.fullName,
          error: error.message,
        });
      }
    }

    // --------------------------------------------------
    // 6. Return result
    // --------------------------------------------------
    return res.status(201).json({
      message: `Fee allocated to ${allocations.length} students in class ${selectedClass}`,
      data: {
        className: selectedClass,
        feeStructureId,
        successful: allocations.length,
        failed: errors.length,
        totalStudents: studentsInClass.length,
        allocations,
        errors,
      },
    });
  } catch (error) {
    console.error('Error allocating fee to class:', error);

    return res.status(500).json({
      message: 'Error allocating fee to class',
      error: error.message,
    });
  }
};

// Allocate fee structure to multiple students (bulk allocation)
exports.allocateFeeToMultipleStudents = async (req, res) => {
  try {
    const {
      studentIds,
      feeStructureId,
      discount,
      discountReason,
      dueDate,
      allocationBatch,
      purpose,
    } = req.body;

    // Validation
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        message: 'Student IDs array is required',
      });
    }

    if (!feeStructureId) {
      return res.status(400).json({
        message: 'Fee Structure ID is required',
      });
    }

    // Check if fee structure exists
    const feeStructure = await feeStructures.findByPk(feeStructureId);
    if (!feeStructure) {
      return res.status(404).json({
        message: 'Fee structure not found',
      });
    }

    const discountAmount = parseFloat(discount) || 0;
    const totalAmount = parseFloat(feeStructure.totalAmount);
    const balance = totalAmount - discountAmount;

    const allocations = [];
    const errors = [];

    for (const studentId of studentIds) {
      try {
        // Check if student exists
        const student = await students.findByPk(studentId);
        if (!student) {
          errors.push({ studentId, error: 'Student not found' });
          continue;
        }

        // Check if already allocated (same structure + batch combination)
        const whereClause = {
          studentId,
          feeStructureId,
        };

        if (allocationBatch) {
          whereClause.allocationBatch = allocationBatch;
        }

        const existingAllocation = await feeAllocations.findOne({
          where: whereClause,
        });

        if (existingAllocation) {
          errors.push({ studentId, error: 'Already allocated for this batch' });
          continue;
        }

        // Create allocation
        const allocation = await feeAllocations.create({
          studentId,
          feeStructureId,
          totalAmount,
          paidAmount: 0,
          balance,
          status: 'pending',
          discount: discountAmount,
          discountReason: discountReason?.trim(),
          dueDate: dueDate || feeStructure.dueDate,
          allocationDate: new Date(),
          allocationBatch: allocationBatch?.trim() || null,
          purpose: purpose || 'tuition',
          allocatedBy: req.user?.id || null,
        });

        allocations.push(allocation);
      } catch (error) {
        errors.push({ studentId, error: error.message });
      }
    }

    res.status(201).json({
      message: `Fee allocated to ${allocations.length} students`,
      data: {
        successful: allocations.length,
        failed: errors.length,
        allocations,
        errors,
      },
    });
  } catch (error) {
    console.error('Error allocating fee to multiple students:', error);
    res.status(500).json({
      message: 'Error allocating fee to multiple students',
      error: error.message,
    });
  }
};
// Get all fee allocations
exports.getAllFeeAllocations = async (req, res) => {
  try {
    const {
      studentId,
      feeStructureId,
      status,
      academicYear,
      class: className,
    } = req.query;

    const where = {};
    if (studentId) where.studentId = studentId;
    if (feeStructureId) where.feeStructureId = feeStructureId;
    if (status) where.status = status;

    const include = [
      {
        model: students,
        as: 'student',
        attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section', 'phone'],
      },
      {
        model: feeStructures,
        as: 'feeStructure',
        include: [
          {
            model: feeStructureItems,
            as: 'items',
            include: [
              {
                model: feeCategories,
                as: 'category',
              },
            ],
          },
        ],
      },
    ];

    // Filter by academic year or class if provided
    if (academicYear || className) {
      const structureWhere = {};
      if (academicYear) structureWhere.academicYear = academicYear;
      if (className) structureWhere.class = className;
      include[1].where = structureWhere;
    }

    const allocations = await feeAllocations.findAll({
      where,
      include,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: 'Fee allocations fetched successfully',
      data: allocations,
    });
  } catch (error) {
    console.error('Error fetching fee allocations:', error);
    res.status(500).json({
      message: 'Error fetching fee allocations',
      error: error.message,
    });
  }
};

// Get fee allocation by ID
exports.getFeeAllocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const allocation = await feeAllocations.findByPk(id, {
      include: [
        {
          model: students,
          as: 'student',
          attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section', 'phone', 'email'],
        },
        {
          model: feeStructures,
          as: 'feeStructure',
          include: [
            {
              model: feeStructureItems,
              as: 'items',
              include: [
                {
                  model: feeCategories,
                  as: 'category',
                },
              ],
            },
          ],
        },
        {
          model: feeTransactions,
          as: 'transactions',
          order: [['transactionDate', 'DESC']],
        },
      ],
    });

    if (!allocation) {
      return res.status(404).json({
        message: 'Fee allocation not found',
      });
    }

    res.json({
      message: 'Fee allocation fetched successfully',
      data: allocation,
    });
  } catch (error) {
    console.error('Error fetching fee allocation:', error);
    res.status(500).json({
      message: 'Error fetching fee allocation',
      error: error.message,
    });
  }
};

// Get fee allocations for a specific student
exports.getStudentFeeAllocations = async (req, res) => {
  try {
    const { studentId } = req.params;

    const allocations = await feeAllocations.findAll({
      where: { studentId },
      include: [
        {
          model: feeStructures,
          as: 'feeStructure',
          include: [
            {
              model: feeStructureItems,
              as: 'items',
              include: [
                {
                  model: feeCategories,
                  as: 'category',
                },
              ],
            },
          ],
        },
        {
          model: feeTransactions,
          as: 'transactions',
          order: [['transactionDate', 'DESC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Calculate summary
    const summary = {
      totalAllocated: allocations.reduce((sum, a) => sum + parseFloat(a.totalAmount), 0),
      totalPaid: allocations.reduce((sum, a) => sum + parseFloat(a.paidAmount), 0),
      totalBalance: allocations.reduce((sum, a) => sum + parseFloat(a.balance), 0),
      totalDiscount: allocations.reduce((sum, a) => sum + parseFloat(a.discount || 0), 0),
      statusCounts: {
        pending: allocations.filter(a => a.status === 'pending').length,
        partial: allocations.filter(a => a.status === 'partial').length,
        paid: allocations.filter(a => a.status === 'paid').length,
        overdue: allocations.filter(a => a.status === 'overdue').length,
      },
    };

    res.json({
      message: 'Student fee allocations fetched successfully',
      data: {
        allocations,
        summary,
      },
    });
  } catch (error) {
    console.error('Error fetching student fee allocations:', error);
    res.status(500).json({
      message: 'Error fetching student fee allocations',
      error: error.message,
    });
  }
};

// Update fee allocation
exports.updateFeeAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      discount,
      discountReason,
      dueDate,
      notes,
      status,
    } = req.body;

    const allocation = await feeAllocations.findByPk(id);

    if (!allocation) {
      return res.status(404).json({
        message: 'Fee allocation not found',
      });
    }

    // Update fields
    if (discount !== undefined) {
      const discountAmount = parseFloat(discount);
      if (discountAmount < 0) {
        return res.status(400).json({
          message: 'Discount cannot be negative',
        });
      }
      allocation.discount = discountAmount;
      // Recalculate balance
      allocation.balance = parseFloat(allocation.totalAmount) - parseFloat(allocation.paidAmount) - discountAmount;
    }

    if (discountReason !== undefined) allocation.discountReason = discountReason?.trim();
    if (dueDate !== undefined) allocation.dueDate = dueDate;
    if (notes !== undefined) allocation.notes = notes?.trim();
    if (status !== undefined) allocation.status = status;

    await allocation.save();

    // Fetch updated allocation
    const updatedAllocation = await feeAllocations.findByPk(id, {
      include: [
        {
          model: students,
          as: 'student',
          attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section'],
        },
        {
          model: feeStructures,
          as: 'feeStructure',
        },
      ],
    });

    res.json({
      message: 'Fee allocation updated successfully',
      data: updatedAllocation,
    });
  } catch (error) {
    console.error('Error updating fee allocation:', error);
    res.status(500).json({
      message: 'Error updating fee allocation',
      error: error.message,
    });
  }
};

// Delete fee allocation
exports.deleteFeeAllocation = async (req, res) => {
  try {
    const { id } = req.params;

    const allocation = await feeAllocations.findByPk(id, {
      include: [
        {
          model: feeTransactions,
          as: 'transactions',
        },
      ],
    });

    if (!allocation) {
      return res.status(404).json({
        message: 'Fee allocation not found',
      });
    }

    // Check if there are any transactions
    if (allocation.transactions && allocation.transactions.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete fee allocation with existing transactions',
      });
    }

    await allocation.destroy();

    res.json({
      message: 'Fee allocation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting fee allocation:', error);
    res.status(500).json({
      message: 'Error deleting fee allocation',
      error: error.message,
    });
  }
};
