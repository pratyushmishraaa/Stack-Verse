import Problem from '../../models/problem.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const createProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(problem);
});

export default createProblem;
