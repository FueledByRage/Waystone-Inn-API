module.exports = async function(error, _req, res, cb){
    const { code, message } = error
    return res.status(code ? code : 500).send(message)
}