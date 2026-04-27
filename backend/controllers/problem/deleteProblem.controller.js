import Problem from '../../models/problem.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndDelete(req.params.id);
  if (!problem) return res.status(404).json({ message: 'Problem not found' });
  res.status(200).json({ message: 'Problem deleted' });
});

export default deleteProblem;
