import express from 'express';
import createProblem from '../controllers/problem/createProblem.controller.js';
import getAllProblems from '../controllers/problem/getAllProblems.controller.js';
import getProblemById from '../controllers/problem/getProblemById.controller.js';
import updateProblem from '../controllers/problem/updateProblem.controller.js';
import deleteProblem from '../controllers/problem/deleteProblem.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import createProblemValidator from '../validator/problem/createProblem.validator.js';
import updateProblemValidator from '../validator/problem/updateProblem.validator.js';

const router = express.Router();

router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', protect, adminOnly, createProblemValidator, createProblem);
router.put('/:id', protect, adminOnly, updateProblemValidator, updateProblem);
router.delete('/:id', protect, adminOnly, deleteProblem);

export default router;
