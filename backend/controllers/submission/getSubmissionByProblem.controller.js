import Submission from '../../models/submission.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const getSubmissionByProblem = asyncHandler(async (req, res) => {
  const submission = await Submission.findOne({
    user: req.user.id,
    problem: req.params.problemId,
  }).populate('problem', 'title difficulty category');

  if (!submission) return res.status(404).json({ message: 'No submission found' });

  res.status(200).json(submission);
});

export default getSubmissionByProblem;
