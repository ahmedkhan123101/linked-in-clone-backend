const passport = require('passport')
const httpStatus = require('http-status')

const auth = async (req, res, next) => {
    return new Promise((resolve, reject) => {
        //Using passport.authenticate to find token in header, decode jwt, find user in db, handle errors.
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err || info || !user) {
                const error = new Error("Please authenticate")
                error.statusCode = 401;
                return reject(error)
            }
            //For success, attach user to req obj so can use in controller next to where this middleware is called.
            req.user = user
            resolve()
        })(req, res, next)//To immediately run function.
    })
        .then(() => next())//Passes to controller
        .catch(err => next(err))
}

module.exports = auth