import Problem from '../../models/problem.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const getProblemById = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) return res.status(404).json({ message: 'Problem not found' });
  res.status(200).json(problem);
});

export default getProblemById;
