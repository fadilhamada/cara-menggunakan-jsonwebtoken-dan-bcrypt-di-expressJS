const response = (statusCode, data, message, res) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        data
    })
}

const validation = (statusCode, message, res) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
    })
}

module.exports = {
    response,
    validation
}