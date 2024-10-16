const express = require('express');
const { getCandidates, getCandidate, createCandidate, deleteCandidate, updateCandidate } = require('../controllers/candidateController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // Correctly import the upload middleware

const router = express.Router();


router.get('/', getCandidates);
router.get('/:id', getCandidate);
router.post('/', auth, upload, createCandidate); // Use the upload middleware directly
router.post('/update/:id', upload, updateCandidate);
router.post('/delete/:id', deleteCandidate);



module.exports = router;






