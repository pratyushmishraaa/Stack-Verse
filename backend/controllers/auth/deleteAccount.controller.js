import User from '../../models/user.model.js';
import Submission from '../../models/submission.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: 'Incorrect password' });

  // Delete all submissions by this user
  await Submission.deleteMany({ user: req.user.id });

  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({ message: 'Account deleted successfully' });
});

export default deleteAccount;
