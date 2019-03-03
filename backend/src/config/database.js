const mongoose = require('mongoose')

module.exports = mongoose.connect('mongodb://localhost:27017/money', {useNewUrlParser: true})
mongoose.Promise = global.Promise

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório"