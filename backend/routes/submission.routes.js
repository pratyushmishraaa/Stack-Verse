import express from 'express';
import createSubmission from '../controllers/submission/createSubmission.controller.js';
import getMySubmissions from '../controllers/submission/getMySubmissions.controller.js';
import getSubmissionByProblem from '../controllers/submission/getSubmissionByProblem.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createSubmission);
router.get('/my', protect, getMySubmissions);
router.get('/:problemId', protect, getSubmissionByProblem);

export default router;
