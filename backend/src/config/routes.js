const express = require('express')

module.exports = function(server){
    //URL Base
    const router = express.Router()
    server.use('/api', router)

    //Routes billing Cycle
    const BillingCycle = require('../api/billingCycle/billingCycleService')
    BillingCycle.register(router, '/billingCycles')
}