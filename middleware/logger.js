const logger = (req, res, next) => {
    console.log("Its a logger file")
    next()
}

module.exports = logger;