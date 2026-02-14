const router = require('express').Router();
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, me);

module.exports = router;
