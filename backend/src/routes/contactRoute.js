const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Public route - Anyone can submit a contact form
router.post('/', contactController.createContact);

// Protected routes - Admin only
router.get('/', protectAdmin, contactController.getAllContacts);
router.get('/:id', protectAdmin, contactController.getContactById);
router.put('/:id', protectAdmin, contactController.updateContact);
router.delete('/:id', protectAdmin, contactController.deleteContact);

module.exports = router;
