const express = require('express')
const authRoute = require('./auth.route.cjs')
const postRoute = require('./post.route.cjs')

const router = express.Router()

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/posts',
        route: postRoute
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router;