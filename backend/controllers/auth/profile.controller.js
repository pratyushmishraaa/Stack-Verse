import User from '../../models/user.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json(user);
});

export default getMe;
