module.exports = function errorFactory( status = undefined, message){
    var error = new Error(message)
    error.code = status
    return error
}