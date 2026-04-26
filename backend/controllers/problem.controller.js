import Problem from '../models/problem.model.js';

// @POST /api/problems  (admin only)
export const createProblem = async (req, res) => {
  try {
    const problem = await Problem.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/problems  (public)
export const getAllProblems = async (req, res) => {
  try {
    const { difficulty, tag, search } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = { $in: [tag] };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const problems = await Problem.find(filter)
      .select('-testCases -starterCode')
      .sort({ createdAt: -1 });

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/problems/:id  (public)
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/problems/:id  (admin only)
export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/problems/:id  (admin only)
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.status(200).json({ message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
