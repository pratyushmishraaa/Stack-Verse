import Submission from '../models/submission.model.js';
import User from '../models/user.model.js';
import Problem from '../models/problem.model.js';

// @POST /api/submissions  — submit solution
export const createSubmission = async (req, res) => {
  try {
    const { problemId, code, note } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      note,
    });

    // Add problem to user's solvedProblems if not already there
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { solvedProblems: problemId },
    });

    // Increment solvedCount on problem
    await Problem.findByIdAndUpdate(problemId, { $inc: { solvedCount: 1 } });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/submissions/my  — get logged in user's submissions
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('problem', 'title difficulty category')
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/submissions/:problemId  — get my submission for a specific problem
export const getSubmissionByProblem = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      user: req.user.id,
      problem: req.params.problemId,
    }).populate('problem', 'title difficulty category');

    if (!submission) return res.status(404).json({ message: 'No submission found' });

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
