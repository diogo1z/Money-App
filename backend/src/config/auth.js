const jwt = require('jsonwebtoken')
const env = require('../.env')

module.exports = (req, res, next) => {
    
    
    if (req.method === 'OPTIONS') {
        next()
    } else {
        const token = req.body.token || req.query.token || req.headers['authorization']

        if (!token) {
            return res.status(403).send({
                errors: ['No token provided']
            })
        }

        jwt.verify(token, env.authSecret, function (err, decoded) {
            if (err) {
                return res.status(403).send({
                    errors: ['Failde to authenticate token']
                })
            }
            else {
                //send token to next filters
                req.decoded = decoded
                next()
            }
        })
    }
    
}