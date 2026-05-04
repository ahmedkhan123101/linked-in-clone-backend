const express = require('express')
const authRoute = require('./auth.route.js')
const postRoute = require('./post.route.js')
const connectionRoute = require('./connection.route.js')
const userRoute = require('./user.route.js')

const router = express.Router()

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/posts',
        route: postRoute
    },
    {
        path: '/connections',
        route: connectionRoute
    },
    {
        path: '/users',
        route: userRoute
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router;