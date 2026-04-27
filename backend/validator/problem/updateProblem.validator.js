const validDifficulties = ['beginner', 'intermediate', 'advanced'];
const validCategories = ['frontend', 'backend', 'fullstack', 'database', 'devops'];

const updateProblemValidator = (req, res, next) => {
  const { difficulty, category } = req.body;
  const errors = [];

  if (difficulty && !validDifficulties.includes(difficulty)) {
    errors.push('Difficulty must be beginner, intermediate or advanced');
  }

  if (category && !validCategories.includes(category)) {
    errors.push('Category must be frontend, backend, fullstack, database or devops');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export default updateProblemValidator;
