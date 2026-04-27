import Problem from '../../models/problem.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!problem) return res.status(404).json({ message: 'Problem not found' });
  res.status(200).json(problem);
});

export default updateProblem;
