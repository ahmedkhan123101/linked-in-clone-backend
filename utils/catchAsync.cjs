const catchAsync = (fn) => (req, res, next) => {//what is this format?
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
}

module.exports = catchAsync;