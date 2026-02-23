const express = require('express')
const router = express.Router();
const auth = require('../../middlewares/auth.cjs')
const connectionController = require('../../controllers/connection.controller.cjs')

router.post('/request/:recipientId', auth, connectionController.sendRequest)
router.patch('/accept/:connectionId', auth, connectionController.acceptRequest)
router.get('/', auth, connectionController.getConnections)
router.delete('/ignore/:senderId', auth, connectionController.ignoreRequest)

module.exports = router;