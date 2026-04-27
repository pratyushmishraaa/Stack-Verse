import User from '../../models/user.model.js';
import asyncHandler from '../../utils/asyncHandler.js';

const updateProfile = asyncHandler(async (req, res) => {
  const { username, avatar, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Update username if provided
  if (username && username !== user.username) {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already taken' });
    user.username = username;
  }

  // Update avatar if provided
  if (avatar !== undefined) user.avatar = avatar;

  // Change password if provided
  if (currentPassword && newPassword) {
    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
    user.password = newPassword;
  }

  await user.save();

  res.status(200).json({
    id:       user._id,
    username: user.username,
    email:    user.email,
    avatar:   user.avatar,
    role:     user.role,
  });
});

export default updateProfile;
