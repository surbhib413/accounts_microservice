const accountBalance = require("../db/models/account_balance")

const AccountBalanceService = (() => {
    let instance

    function AccountBalanceService() {

    }

    /**
     * @param {object} data
     * @return {object}
     */
    AccountBalanceService.prototype.createAccountBalance = (data) => {
        return new Promise((resolve, reject) => {
            let _accountBalance = new accountBalance(data)
            _accountBalance.save((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    // /**
    //  * @param {object} query
    //  * @return {Array}
    //  */
    // AccountService.prototype.getAccountsByClient = (query) => {
    //     return new Promise((resolve, reject) => {
    //         account.find(query, (err, result) => {
    //             // console.log(result)
    //             err ? reject(err) : resolve(result)
    //         })
    //     })
    // }

    AccountBalanceService.prototype.getAccountBalanceOnDate = (query) => {
        return new Promise((resolve, reject) => {
            let regex = new RegExp(["^", query.client_name, "$"].join(""), "i");
            let nextDate = new Date(query.entry_date)
            nextDate.setDate(nextDate.getDate() + 1)
            accountBalance.aggregate([{
                $match: {
                    client_name: { $regex: regex },
                    entry_date: {
                        $gte: new Date(query.entry_date),
                        $lt: new Date(nextDate)
                    }
                }
            }, {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$available_balance"
                    }
                }
            }], (err, result) => {
                console.log(result)
                err ? reject(err) : resolve(result[0]['total'])
            })
        })
    }

    AccountBalanceService.prototype.getAccountsSumByDate = (query) => {
        return new Promise((resolve, reject) => {
            let regex = new RegExp(["^", query.client_name, "$"].join(""), "i");
            accountBalance.aggregate([{
                $match: {
                    client_name: { $regex: regex },
                    entry_date: { $gte: new Date(query.start_date), $lte: new Date(query.end_date) }
                }
            },{
                $group: {
                    _id: "$entry_date",
                    sum_value: { $sum: "$available_balance" }
                }
            },{
                $sort: {
                    _id: 1
                }
            },{
                $group: {
                    _id: 0,
                    dates: { $push: "$_id" },
                    total_balances: { $push: "$sum_value" }
                }
            }], (err, result) => {
                // console.log(result)
                err ? reject(err) : resolve(result[0])
            })
        })
    }

    AccountBalanceService.prototype.getAccountBalanceByDate = (query) => {
        return new Promise((resolve, reject) => {
            let regex = new RegExp(["^", query.client_name, "$"].join(""), "i");
            accountBalance.aggregate([{
                $match: {
                    client_name: { $regex: regex },
                    account_number: query.account_number,
                    entry_date: { $gte: new Date(query.start_date), $lte: new Date(query.end_date) }
                }
            },{
                $sort: {
                    entry_date: 1
                }
            }], (err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    // AccountBalanceService.prototype.test = (query) => {
    //     return new Promise((resolve, reject) => {
    //         accountBalance.aggregate([{
    //                 "$match": {
    //                     client_name: query.client_name
    //                 }
    //             },
    //             { "$group": {
    //                 "_id": "$entry_date",
    //                 "sum_value" : { "$sum" : "$available_balance" } }
    //             },
    //             { "$group": {
    //                 "_id": 0,
    //                 "dates" : { "$push" : "$_id" },
    //                 "sum_values" : { "$push" : "$sum_value" } }
    //             },            
    //             { "$project" : {
    //                 "dates" : "$dates",
    //                 "total_balances" : "$sum_values" }
    //             }], (err, result) => {
    //             console.log(result[0])
    //             err ? reject(err) : resolve(result[0])
    //         })
    //     })
    // }x


    function createInstance() {
        const object = new AccountBalanceService()
        return object;
    }


    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance()
            }
            return instance;
        }
    }
})()


module.exports = { AccountBalanceService }