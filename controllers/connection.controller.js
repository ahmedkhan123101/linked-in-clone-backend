const httpStatus = require('http-status').default
const catchAsync = require('../utils/catchAsync.js')
const Connection = require('../models/connection.model.js')
const ApiError = require('../utils/ApiError.js')

const sendRequest = catchAsync(async (req, res) => {
    const requesterId = req.user.id
    const { recipientId } = req.params;

    if (requesterId === recipientId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You cannot connect with yourself.")
    }

    const existingConnection = await Connection.findOne({
        $or: [
            { requester: requesterId, recipient: recipientId },
            { requester: recipientId, recipient: requesterId },
        ]
    })

    if (existingConnection) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Connection or request already exists.")
    }

    const connection = await Connection.create({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    })

    res.status(httpStatus.CREATED).send(connection);
})

const removeConnection = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { connectionId } = req.params;

    const connection = await Connection.findOneAndDelete({
        _id: connectionId,
        status: 'accepted',
        $or: [
            { requester: userId },
            { recipient: userId }
        ]
    });

    if (!connection) {
        throw new ApiError(httpStatus.NOT_FOUND, "Connection not found or already removed.")
    }

    res.status(httpStatus.NO_CONTENT).send();
});

const acceptRequest = catchAsync(async (req, res) => {
    const { connectionId } = req.params
    const userId = req.user.id

    const connection = await Connection.findById(connectionId)

    if (!connection) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Connection req (doc) not found.')
    }
    //Only recipient can accept request.
    if (connection.recipient.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized to accept this request.")
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
        throw new ApiError(httpStatus.NOT_FOUND, "Connection request/doc not found.")
    }

    res.status(httpStatus.NO_CONTENT).send()
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
        throw new ApiError(httpStatus.NOT_FOUND, "No pending request found to cancel.")
    }

    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = { sendRequest, acceptRequest, getConnections, ignoreRequest, getMyConnections, cancelRequest, removeConnection }
