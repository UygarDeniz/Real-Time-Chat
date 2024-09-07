import express from 'express';
import {
  logout,
  register,
  login,
  currentUser,
  getUserById,
} from '../controllers/userControllers.js';
import { authUser } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', authUser, currentUser);
router.get('/:id', authUser, getUserById);

export default router;
