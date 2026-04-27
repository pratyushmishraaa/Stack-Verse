import express from 'express';
import register from '../controllers/auth/register.controller.js';
import login from '../controllers/auth/login.controller.js';
import getMe from '../controllers/auth/profile.controller.js';
import updateProfile from '../controllers/auth/updateProfile.controller.js';
import deleteAccount from '../controllers/auth/deleteAccount.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import registerValidator from '../validator/auth/register.validator.js';
import loginValidator from '../validator/auth/login.validator.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteAccount);

export default router;
