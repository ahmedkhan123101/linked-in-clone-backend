const express = require('express')
const router = express.Router();
const auth = require('../../middlewares/auth.js')
const connectionController = require('../../controllers/connection.controller.js')

router.post('/request/:recipientId', auth, connectionController.sendRequest)
router.patch('/accept/:connectionId', auth, connectionController.acceptRequest)
router.get('/', auth, connectionController.getConnections)
router.get('/my-connections', auth, connectionController.getMyConnections)
router.delete('/ignore/:senderId', auth, connectionController.ignoreRequest)
router.delete('/cancel/:recipientId', auth, connectionController.cancelRequest)
router.delete('/remove/:connectionId', auth, connectionController.removeConnection);

module.exports = router;