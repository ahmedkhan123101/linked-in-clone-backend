const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '../../.env') })

module.exports = {
    env: process.env.NODE_ENV || 'development',
    mongoose: {
        url: process.env.MONGO_URI
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpMin: process.env.JWT_ACCESS_EXP_MIN,
        refreshExpMin: process.env.JWT_REFRESH_EXPIRATION_MINUTES,
    }
}