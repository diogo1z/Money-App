const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('../../.env')


const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{5,12}$/

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''

    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user && bcrypt.compareSync(password, user.password)) {

            const token = jwt.sign({
                data: user
            }, env.authSecret, { expiresIn: '12h' })

            const { name, email } = user
            return res.status(200).send({ name, email, token })
        }
        else {
            return res.status(400).send({ errors: ["Usuário/Senha inválidos"] })
        }

    })
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''

    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })

}

const signup = (req, res, next) => {

    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirmPassword || ''

    if (!email.match(emailRegex)) {
        return res.status(400).send({ errors: ["E-mail inválido"] })
    }

    if (!password.match(passwordRegex)) {
        return res.status(400)
            .send({ errors: ["Senha precisa ter: letra maiúscula, minúscula, um número e um caracter especial"] })
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ errors: ["As senhas não conferem"] })
    }



    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ errors: ["Usuário já cadastrado"] })
        } else {
            const newUser = new User({ name, email, password: passwordHash })
            newUser.save(err => {
                if (err) {
                    return sendErrorsFromDB(res, err)
                } else {
                    login(req, res, next)
                }
            })
        }
    })

}

module.exports = { signup, validateToken, login }