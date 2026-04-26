import express from 'express';
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} from '../controllers/problem.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', protect, adminOnly, createProblem);
router.put('/:id', protect, adminOnly, updateProblem);
router.delete('/:id', protect, adminOnly, deleteProblem);

export default router;
