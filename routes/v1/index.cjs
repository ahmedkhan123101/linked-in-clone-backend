const express = require('express')
const authRoute = require('./auth.route.cjs')
const postRoute = require('./post.route.cjs')
const connectionRoute = require('./connection.route.cjs')

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
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router;