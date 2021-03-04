const accountTransaction = require("../db/models/account_transactions")
const forecastData = require("../db/models/forecast")

const AccountTransactionService = (() => {
    let instance

    function AccountTransactionService() {

    }

    /**
     * @param {object} data
     * @return {object}
     */
    AccountTransactionService.prototype.createTransaction = (data) => {
        return new Promise((resolve, reject) => {
            let _accountTransaction = new accountTransaction(data)
            _accountTransaction.save((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    /**
     * @param {object} data
     * @return {object}
     */
    AccountTransactionService.prototype.createForecast = (data) => {
        return new Promise((resolve, reject) => {
            forecastData.insertMany(data, (err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    AccountTransactionService.prototype.getForecast = () => {
        return new Promise((resolve, reject) => {
            forecastData.find({}, (err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    /**
     * @param {object} query
     * @return {Array}
     */
    AccountTransactionService.prototype.getTransactionsByAccount = (query) => {
        let match = {
            "account_number": query.account_number
        }
        if(query.type) match['type'] = query.type
        if(query.start_date && query.end_date){
            match['transaction_date'] = {
                "$gte": new Date(query.start_date), "$lte": new Date(query.end_date)  
            }
        }
        let options = { sort: { transaction_date: 1 } } 
        return new Promise((resolve, reject) => {
            accountTransaction.find(match, null, options, (err, result) => {
                // console.log(result)
                err ? reject(err) : resolve(result)
            })
        })
    }

    /**
     * @param {object} query
     * @return {Array}
     */
    AccountTransactionService.prototype.getTransactionsByDate = (query) => {
        let options = { sort: { transaction_date: 1 } } 
        let query1 = { "client_name": query.client_name , "transaction_date":  {
              "$gte": new Date(query.start_date), "$lte": new Date(query.end_date)  
        }  } //start date - old date, end date - future date
        return new Promise((resolve, reject) => {
            accountTransaction.find(query1, null, options, (err, result) => {
                // console.log(result)
                err ? reject(err) : resolve(result)
            })
        })
    }
    // /**
    //  * @param {object} query
    //  * @return {Array}
    //  */
    // AccountTransactionService.prototype.getForecast = (query) => {
    //     let options = { sort: { transaction_date: 1 } } 
    //     let query1 = { "client_name": query.client_name , "transaction_date":  { "$gte": new Date(query.end_date) , "$lte": new Date(query.start_date)  }  }
    //     return new Promise((resolve, reject) => {
    //         accountTransaction.find(query1, null, options, (err, result) => {
    //             // console.log(result)
    //             err ? reject(err) : resolve(result)
    //         })
    //     })
    // }
    AccountTransactionService.prototype.getTransactionsDataByClient = (query) => {
        let match = { "type": query.type, "client_name": query.client_name }
        // if(query.match_key && query.match_value){
        //     match[query.match_key] = query.match_value
        // }
        return new Promise((resolve, reject) => {
            accountTransaction.aggregate([{
                "$match": match
            },{ "$group" : {
                "_id" : `$${query.group}`,
                "sum_value" : { "$sum" : "$amount" } }
            },
            { "$group" : {
                "_id": 0,
                "keys" : { "$push" : "$_id" },
                "sum_values" : { "$push" : "$sum_value" },
                "total" : { "$sum" : "$sum_value" } }
            },
            { "$project" : {
                "keys" : "$keys",
                "sum_values" : "$sum_values"
                }
            }], (err, result) => {
                console.log(result)
                err ? reject(err) : resolve(result[0])
            })
        })
    }

    AccountTransactionService.prototype.getTransactionsDataByBeneficiary = (beneficiary) => {
        return new Promise((resolve, reject) => {
            accountTransaction.aggregate([{
                "$match": { "client_name": "deloitte middle east", "beneficiary_name": beneficiary }
            },{ "$group" : {
                "_id" : "$debit_bank_name",
                "value" : { "$sum" : "$debit_aed" } }
            },
            { "$group" : {
                "_id": 0,
                "keys" : { "$push" : "$_id" },
                "sum" : { "$push" : "$value" } }
            },
            { "$project" : {
                "keys" : "$keys",
                "sum" : "$sum"
                }
            }], (err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    /**
     * @description get account transaction data for bar chart by account number and group by beneficiary or payer
     * and match(filter) by entity name
     * @param {object} query - params - { account_number, group, match_key, match_value, sum }
     * @return {Array}
     */
    // AccountTransactionService.prototype.getTransactionsDataByAccount2 = (query) => {
    //     let match = { "account_number": query.account_number }
    //     if(query.match_key && query.match_value){ // assign entity name if exist
    //         match[query.match_key] = query.match_value
    //     }
    //     return new Promise((resolve, reject) => {
    //         account.aggregate([{
    //             "$match": match // account number, entity name(optional)
    //         },{ "$group" : {
    //             "_id" : `$${query.group}`, // beneficiary or payer
    //             "sum_value" : { "$sum" : `$${query.sum}` } } // credit or debit
    //         },
    //         { "$group" : {
    //             "_id": 0,
    //             "keys" : { "$push" : "$_id" },
    //             "sum_values" : { "$push" : "$sum_value" } }
    //         },
    //         { "$project" : {
    //             "keys" : "$keys",
    //             "sum_values" : "$sum_values"
    //             }
    //         }], (err, result) => {
    //             err ? reject(err) : resolve(result)
    //         })
    //     })
    // }

    AccountTransactionService.prototype.getTransactionsDataByAccount = (query) => {
        // console.log(query)
        let match = { 
            "account_number": query.account_number,
            "type": { $in: query.type }
        }
        return new Promise((resolve, reject) => {
            accountTransaction.aggregate([{
                "$match": match
            },{ "$group" : {
                "_id" : `$${query.group}`,
                "sum_value" : { "$sum" : "$amount" } }
            },
            { "$group" : {
                "_id": 0,
                "keys" : { "$push" : "$_id" },
                "sum_values" : { "$push" : "$sum_value" },
                "total" : { "$sum" : "$sum_value" } }
            },
            { "$project" : {
                "keys" : "$keys",
                "sum_values" : "$sum_values",
                "percentages" : {
                    "$map" : {
                        "input" : "$sum_values", "as" : "s", "in" : {
                                "$multiply" : [{ "$divide" : ["$$s", "$total"] }, 100] 
                            } 
                        } 
                    } 
                }
            }], (err, result) => {
                console.log(result[0])
                err ? reject(err) : resolve(result[0])
            })
        })
    }

    // AccountTransactionService.prototype.test = (query) => {
    //     return new Promise((resolve, reject) => {
    //         accountTransaction.aggregate([{
    //             "$match": { "client_name": "deloitte middle east" }
    //         },{ "$group" : {
    //             "_id" : { beneficiary_name: "$beneficiary_name", bank_name: "$bank_name" },
    //             "debit_aed": { $addToSet: "$debit_aed" }
    //             }
    //         },{
    //             "$group": {
    //                 "_id": { beneficiary_name: "$_id.beneficiary_name" },
    //                 "group": { $addToSet: { bank_name: "$_id.bank_name", names:"$names" } }
    //             }
    //         }], (err, result) => {
    //             err ? reject(err) : resolve(result)
    //         })
    //     })
    // }

    function createInstance() {
        const object = new AccountTransactionService()
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


module.exports = { AccountTransactionService }