const express = require('express')
const auth = require('./auth')


    module.exports = function(server){
    //URL protected, only works with a valid token
    const protectedApi = express.Router()
    server.use('/api', protectedApi)

    protectedApi.use(auth)

    //Routes billing Cycle
    const BillingCycle = require('../api/billingCycle/billingCycleService')
    BillingCycle.register(protectedApi, '/billingCycles')


    //URL Open
    const openApi = express.Router()
    server.use('/oapi', openApi)

    //Routes for authorization
    const AuthService = require('../api/user/authService')
    openApi.post('/login',AuthService.login)
    openApi.post('/signup',AuthService.signup)
    openApi.post('/validateToken',AuthService.validateToken)
}
