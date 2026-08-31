const express = require('express');

const router = express.Router();

const {
    assignSubjectToClass,
    getSubjectsByClass,
    getClassesBySubject,
    removeSubjectFromClass,
    updateClassSubject,
} = require('../controllers/classSubjectController');

// Assign subject to class
router.post('/', assignSubjectToClass);

// Get subjects assigned to a class
router.get('/class/:classId', getSubjectsByClass);

// Get classes assigned to a subject
router.get('/subject/:subjectId', getClassesBySubject);

// Update assignment
router.patch('/:id', updateClassSubject);

// Remove subject from class
router.delete(
    '/class/:classId/subject/:subjectId',
    removeSubjectFromClass
);

module.exports = router;