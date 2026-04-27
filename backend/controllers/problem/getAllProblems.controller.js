import Problem from '../../models/problem.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const getAllProblems = asyncHandler(async (req, res) => {
  const { difficulty, tag, category, search } = req.query;
  const filter = {};

  if (difficulty) filter.difficulty = difficulty;
  if (tag) filter.tags = { $in: [tag] };
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const problems = await Problem.find(filter)
    .select('-starterCode')
    .sort({ createdAt: -1 });

  res.status(200).json(problems);
});

export default getAllProblems;
