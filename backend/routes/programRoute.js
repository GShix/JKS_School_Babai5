const { fetchPrograms, addProgram, fetchSingleProgram, deleteProgram, updateProgram } = require('../controllers/programController');

const router = require('express').Router();

router.route("/programs").get(fetchPrograms).post(addProgram);
router.route("/programs/:id").get(fetchSingleProgram).delete(deleteProgram).patch(updateProgram);

module.exports = router;
