const validDifficulties = ['beginner', 'intermediate', 'advanced'];
const validCategories = ['frontend', 'backend', 'fullstack', 'database', 'devops'];

const createProblemValidator = (req, res, next) => {
  const { title, description, difficulty, category } = req.body;
  const errors = [];

  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }

  if (!difficulty || difficulty.trim() === '') {
    errors.push('Difficulty is required');
  } else if (!validDifficulties.includes(difficulty)) {
    errors.push('Difficulty must be beginner, intermediate or advanced');
  }

  if (!category || category.trim() === '') {
    errors.push('Category is required');
  } else if (!validCategories.includes(category)) {
    errors.push('Category must be frontend, backend, fullstack, database or devops');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export default createProblemValidator;
