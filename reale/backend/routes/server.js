const express = require('express');
const router = express.Router();
const serverController = require('../controllers/server');
const { authenticate } = require('../middleware/auth');

// Server routes
router.post('/', authenticate, serverController.createServer);
router.get('/', authenticate, serverController.getUserServers);
router.get('/:serverId', authenticate, serverController.getServerDetails);
router.post('/:serverId/channels', authenticate, serverController.createChannel);
router.get('/:serverId/channels', authenticate, serverController.getServerChannels);
router.post('/:serverId/members', authenticate, serverController.addServerMember);
router.delete('/:serverId/members/:userId', authenticate, serverController.removeServerMember);
router.post('/:serverId/roles', authenticate, serverController.createRole);
router.put('/:serverId/roles/:roleId', authenticate, serverController.updateRole);
router.delete('/:serverId/roles/:roleId', authenticate, serverController.deleteRole);

module.exports = router;
