import express from 'express';
import {
  logout,
  register,
  login,
  currentUser,
  getUserById,
  refreshToken,
  getUserWithAccessToken,
} from '../controllers/userControllers.js';
import { authUser } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getUserWithAccessToken);
router.get('/:id', authUser, getUserById);
router.post('/refresh-token', refreshToken);

export default router;
