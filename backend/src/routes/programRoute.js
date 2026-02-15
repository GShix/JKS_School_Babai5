const { fetchPrograms, addProgram, fetchSingleProgram, deleteProgram, updateProgram } = require('../controllers/programController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.route("/programs").get(fetchPrograms).post(protectAdmin, requireAdmin, addProgram);
router.route("/programs/:id").get(fetchSingleProgram).delete(protectAdmin, requireAdmin, deleteProgram).patch(protectAdmin, requireAdmin, updateProgram);

module.exports = router;
