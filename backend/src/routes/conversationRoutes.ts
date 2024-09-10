import express from 'express';
import {
  getMyConversations,
  getMessages,
  createMessage,
  checkExistingConversation,
  openConversation,
  getConversationById,
  findOrCreateConversation
} from '../controllers/conversationControllers.js';
import { authUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/check/:userId', authUser, checkExistingConversation);
router.get('/myconversations', authUser, getMyConversations);
router.get('/:conversationId/messages', authUser, getMessages);
router.post('/:conversationId/messages', authUser, createMessage);
router.post('/:conversationId/open', authUser, openConversation);
router.get('/:conversationId', authUser, getConversationById);
router.post('/findOrCreate', authUser, findOrCreateConversation);
export default router;
