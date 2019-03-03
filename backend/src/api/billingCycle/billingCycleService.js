const BillingCycle = require('./billingCycle')
const errorHandler = require('../common/errorHandler')


BillingCycle.methods(['get', 'post', 'put', 'delete'])
BillingCycle.updateOptions({ new: true, runValidators: true })
BillingCycle.after('post', errorHandler).after('put', errorHandler)

//Use function count from mongo to return how many registers have
BillingCycle.route('count', (req, res, next) => {
    BillingCycle.count((error, value) => {
        if (error) {
            res.status(500).json({ errors: [error] })
        }
        else {
            res.json({ value })
        }
    })
})

//Return sum of debts e credits 
BillingCycle.route('summary', (req, res, next) => {
    //Function Aggregate from Mongo
    BillingCycle.aggregate()
        //Create a model with values there will be pass for the next step in that pipeline
        .project({
            credit: { $sum: "$credits.value" },
            debt: { $sum: "$debts.value" }
        })
        //Group values to one, _id is necessary to do this operation
        .group({
            _id: null,
            credit: { $sum: "$credit" },
            debt: { $sum: "$debt" }
        })
        //Supress _id from return
        .project({ _id: 0, credit: 1, debt: 1 })
        //validate if is ok or not
        .exec(function (error, result) {
            if (error) {
                res.status(500).json({ errors: [error] })
            }
            else {
                //if return null send object with zero values
                res.json(result[0] || { credit: 0, debt: 0 })
            }
        })
})

module.exports = BillingCycle