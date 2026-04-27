import Submission from '../../models/submission.model.js';
import Problem from '../../models/problem.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const createSubmission = asyncHandler(async (req, res) => {
  const { problemId, code, note } = req.body;

  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ message: 'Problem not found' });

  const submission = await Submission.create({
    user: req.user.id,
    problem: problemId,
    code,
    note,
  });

  // increment solvedCount on the problem
  await Problem.findByIdAndUpdate(problemId, { $inc: { solvedCount: 1 } });

  res.status(201).json(submission);
});

export default createSubmission;
