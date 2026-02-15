const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const upload = require('../middlewares/messageUploadMiddleware');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', messageController.getAllMessages);
router.get('/:id', messageController.getMessageById);

// Protected routes - Admin only
router.post('/', protectAdmin, upload.single('photo'), messageController.createMessage);
router.put('/:id', protectAdmin, upload.single('photo'), messageController.updateMessage);
router.delete('/:id', protectAdmin, messageController.deleteMessage);

module.exports = router;
