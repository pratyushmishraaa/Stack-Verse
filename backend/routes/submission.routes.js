import express from 'express';
import {
  createSubmission,
  getMySubmissions,
  getSubmissionByProblem,
} from '../controllers/submission.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createSubmission);
router.get('/my', protect, getMySubmissions);
router.get('/:problemId', protect, getSubmissionByProblem);

export default router;
