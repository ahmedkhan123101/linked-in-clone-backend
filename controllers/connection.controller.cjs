const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync.cjs')
const Connection = require('../models/connection.model.cjs')

const sendRequest = catchAsync(async (req, res) => {
    const requesterId = req.user.id
    const { recipientId } = req.params;

    if (requesterId === recipientId) {
        return res.status(400).send({ message: "You cannot connect with yourself." })
    }

    const existingConnection = await Connection.findOne({
        $or: [
            { requester: requesterId, recipient: recipientId },
            { requester: recipientId, recipient: requesterId },
        ]
    })

    if (existingConnection) {
        return res.status(400).send({ message: "Connection or request already exists." })
    }

    const connection = await Connection.create({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    })

    res.status(httpStatus.status.CREATED).send(connection);
})

const acceptRequest = catchAsync(async (req, res) => {
    const { connectionId } = req.params
    const userId = req.user.id

    const connection = await Connection.findById(connectionId)

    if (!connection) {
        return res.status(httpStatus.status.NOT_FOUND).send({ message: 'Connection req (doc) not found.' })
    }
    //Only recipient can accept request.
    if (connection.recipient.toString() !== userId) {
        return res.status(httpStatus.status.FORBIDDEN).send({
            message: "You are not authorized to accept this request."
        })
    }
    //Update connection status.
    connection.status = "accepted"
    await connection.save()
    res.send(connection)
})

const ignoreRequest = catchAsync(async (req, res) => {
    const { senderId } = req.params
    const receiverId = req.user.id

    //Delete request
    const connection = await Connection.findOneAndDelete({
        requester: senderId,
        recipient: receiverId,
        status: 'pending'
    })

    if (!connection) {
        return res.status(404).send({ message: "Connection request/doc not found." })
    }

    res.status(httpStatus.status.NO_CONTENT).send()
})

const getConnections = catchAsync(async (req, res) => {
    const userId = req.user.id

    const connections = await Connection.find({
        $or: [
            { requester: userId },//either user sent connection
            { recipient: userId },//or received connection
        ]
    }).populate('requester', 'name lastName profilePicture')

    res.send(connections)
})

const getMyConnections = catchAsync(async (req, res) => {
    const userId = req.user.id
    //find connections where userId exists and status is accepted.
    const connections = await Connection.find({
        status: 'accepted',
        $or: [
            { recipient: userId },
            { requester: userId }
        ]
    })
        //need both coz if any one of requester or recipient happened to be of currentUser.
        .populate('requester', 'name lastName profilePicture')
        .populate('recipient', 'name lastName profilePicture')
    res.send(connections)
})

const cancelRequest = catchAsync(async (req, res) => {

    const requesterId = req.user.id || req.user._id;
    const { recipientId } = req.params;

    const connection = await Connection.findOneAndDelete({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    });

    if (!connection) {
        return res.status(404).send({ message: "No pending request found to cancel." });
    }

    res.status(httpStatus.status.NO_CONTENT).send();
});

module.exports = { sendRequest, acceptRequest, getConnections, ignoreRequest, getMyConnections, cancelRequest }