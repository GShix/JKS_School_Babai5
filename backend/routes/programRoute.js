const { fetchPrograms, addProgram, fetchSingleProgram } = require('../controllers/programController');

const router = require('express').Router();

router.route("/programs").get(fetchPrograms).post(addProgram);
router.route("/programs/:id").get(fetchSingleProgram);

module.exports = router;
