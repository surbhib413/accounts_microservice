const account = require("../db/models/accounts")

const AccountService = (() => {
    let instance

    function AccountService() {

    }

    /**
     * @param {object} data
     * @return {object}
     */
    AccountService.prototype.createAccount = (data) => {
        return new Promise((resolve, reject) => {
            let _account = new account(data)
            _account.save((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    /**
     * @param {object} data
     * @return {object}
     */
    AccountService.prototype.getAccountByAccountNumber = (query) => {
        return new Promise((resolve, reject) => {
            account.findOne(query, (err, result) => {
                // console.log(result)
                err ? reject(err) : resolve(result)
            })
        })
    }

    /**
     * @param {object} query
     * @return {Array}
     */
    AccountService.prototype.getAccountsByClient = (query) => {
        return new Promise((resolve, reject) => {
            account.find(query, (err, result) => {
                // console.log(result)
                err ? reject(err) : resolve(result)
            })
        })
    }

    // AccountService.prototype.test = (query) => {
    //     return new Promise((resolve, reject) => {
    //         account.aggregate([{
    //             $group: {
    //                 _id: '$bank_name',
    //                 sum: { $sum: 1 },
    //             }
    //         }], (err, result) => {
    //             err ? reject(err) : resolve(result)
    //         })
    //     })
    // }

    AccountService.prototype.getAccountsCountByClient = (query) => {
        return new Promise((resolve, reject) => {
            account.aggregate([{
                "$match": query
            },
            { "$group" : {
                "_id" : "$bank_name",
                "count": { "$sum": 1 },
                "sum_value" : { "$sum" : "$available_balance" } }
            },
            { "$group" : {
                "_id": 0,
                "keys" : { "$push" : "$_id" },
                "counts": { "$push": "$count" },
                "sum_values" : { "$push" : "$sum_value" } }
            },
            { "$project" : {
                "bank_names" : "$keys",
                "counts": "$counts",
                "total_balances" : "$sum_values",
                }
            }], (err, result) => {
                err ? reject(err) : resolve(result[0])
            })
        })
    }

    //get accounts data for donut chart
    AccountService.prototype.getAccountsDataByClient2 = (query) => {
        let entity_arr = [],
            bank_arr = []
        let regex = new RegExp(["^", query.client_name, "$"].join(""), "i");
        let match_query = [ 
            { client_name: { $regex: regex } }
        ]
        if(query.entity_name.length){
            query.entity_name.forEach(element => {
                entity_arr.push({ entity_name: element })
            });
            match_query.push({ $or: entity_arr })
        }
        if(query.bank_name.length){
            query.bank_name.forEach(element => {
                bank_arr.push({ bank_name: element })
            });
            match_query.push({ $or: bank_arr })
        }
        let match = { 
            $and: match_query,
            // $and: [
            //     {
            //         $or: [
            //             { entity_name: "consulting" },
            //             { entity_name: "audit & assurance" }
            //         ]
            //     },
            //     {
            //         client_name: { $regex: regex }
            //     }
            // ]
        }
        return new Promise((resolve, reject) => {
            account.aggregate([{
                "$match": match
            },{ "$group" : {
                "_id" : `$${query.group}`,
                "sum_value" : { "$sum" : "$available_balance" } }
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
                console.log(result)
                err ? reject(err) : resolve(result[0])
            })
        })
    }

    AccountService.prototype.getAccountsDataByClient = (query) => {
        let match = { "client_name": query.client_name }
        if(query.match_key && query.match_value){
            match[query.match_key] = query.match_value
        }
        return new Promise((resolve, reject) => {
            account.aggregate([{
                "$match": match
            },{ "$group" : {
                "_id" : `$${query.group}`,
                "sum_value" : { "$sum" : "$available_balance" } }
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

    /**
     * @description get account balance data by grouping
     * @param {string} client_name
     * @param {string} entity
     * @param {string} group
     * @param {Array} group_values
     * @return {Array}
     */
    AccountService.prototype.getBalanceByGrouping = async (matchQuery, group) => {
        return new Promise((resolve, reject) => {
            account.aggregate([{
                "$match": matchQuery
            },{ 
                "$group" : {
                "_id" : `$${group}`,
                "value" : { "$sum" : "$available_balance" } }
            },{ 
                "$group" : {
                "_id": 0,
                "keys" : { "$push" : "$_id" },
                "sum" : { "$push" : "$value" } }
            }], (err, result) => {
                err ? reject(err) : resolve(result[0])
            })
        })
    }


    function createInstance() {
        const object = new AccountService()
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


module.exports = { AccountService }