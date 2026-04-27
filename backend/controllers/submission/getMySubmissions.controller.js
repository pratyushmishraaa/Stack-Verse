import Submission from '../../models/submission.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ user: req.user.id })
    .populate('problem', 'title difficulty category')
    .sort({ createdAt: -1 });

  res.status(200).json(submissions);
});

export default getMySubmissions;
