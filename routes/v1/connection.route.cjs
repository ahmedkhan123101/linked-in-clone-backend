const express = require('express')
const router = express.Router();
const auth = require('../../middlewares/auth.cjs')
const connectionController = require('../../controllers/connection.controller.cjs')

router.post('/request/:recipientId', auth, connectionController.sendRequest)
router.patch('/accept/:connectionId', auth, connectionController.acceptRequest)

module.exports = router;