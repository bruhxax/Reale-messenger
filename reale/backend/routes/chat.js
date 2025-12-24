const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const { authenticate } = require('../middleware/auth');

// Chat routes
router.post('/', authenticate, chatController.createChat);
router.get('/', authenticate, chatController.getUserChats);
router.get('/:chatId', authenticate, chatController.getChatDetails);
router.post('/:chatId/messages', authenticate, chatController.sendMessage);
router.get('/:chatId/messages', authenticate, chatController.getMessages);
router.put('/:chatId/messages/:messageId', authenticate, chatController.editMessage);
router.delete('/:chatId/messages/:messageId', authenticate, chatController.deleteMessage);
router.post('/:chatId/messages/:messageId/reactions', authenticate, chatController.addReaction);
router.delete('/:chatId/messages/:messageId/reactions', authenticate, chatController.removeReaction);
router.post('/:chatId/pin', authenticate, chatController.pinMessage);
router.delete('/:chatId/pin', authenticate, chatController.unpinMessage);

module.exports = router;
