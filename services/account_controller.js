const { AccountService } = require('../services/accounts')
const { AccountBalanceService } = require('../services/account_balance')
const { AccountTransactionService } = require('../services/account_transactions')

const accountService = AccountService.getInstance()
const accountBalanceService = AccountBalanceService.getInstance()
const accountTransService = AccountTransactionService.getInstance()

const getForecast = async (req, res) => {
    try{
        
       const result = await accountTransService.getForecast()
       res.status(200).send({data: result})
   }catch(err){
       console.log(err)
       res.status(500).send({
           message: "Internal Server Error"
       })
   }
}

const getTransactionsDataByBeneficiary = async (req, res) => {
    try{
        let beneficiaries = ['Firm Services', 'Travel Expense', 'Emirates Telecom Receivables', 'Medical Insurance Payment', 'Other Charges']
        let response = []
        for(let data of beneficiaries){
            let result = await accountTransService.getTransactionsDataByBeneficiary(data)
            response.push({ beneficiary: data, banks: result[0] ? result[0].keys : [], transaction_sum: result[0] ? result[0].sum: [] })
        }
        console.log(response)
        res.status(200).send(response)
    }catch(err){
        console.log(err)
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

// get account balance data for stacked bar
const getBalanceForStackedBar = async (query) => {
    try{
        let result = []
        let entity_arr = query.entity_name
        let bank_arr = query.bank_name,
            region_arr = query.region
        let regex = new RegExp(["^", query.client_name, "$"].join(""), "i")
        let matchQuery = {
            "client_name": { $regex: regex },
            "bank_name": { $in : bank_arr },
            "region": { $in : region_arr }
        }
        for(let entity of entity_arr){
            matchQuery["entity_name"] = entity
            let temp = await accountService.getBalanceByGrouping(matchQuery, "bank_name")
            if(temp)
                result.push({ entity_name: entity, bank_name: temp.keys, available_balance: temp.sum })
        }
        // console.log(result)
        let final_result = []
 
        result.forEach(i => {
            // console.log("//", i.entity_name)
            let bank_wise_balance = []
            for(let j = 0; j < i.bank_name.length; j++){
                bank_wise_balance.push({
                    bank_name: i.bank_name[j],
                    balance: i.available_balance[j]
                })
            }
            // console.log(bank_wise_balance)
            final_result.push({
                entity_name: i.entity_name,
                bank_wise_balance
            })
        })
        console.log(final_result)
        return final_result
    }
    catch(err){
        console.log(err)
    }
}

// get account balance data for stacked bar
const getBalanceForHeatMap = async (query) => {
    try{
        let result = []
        let entity_arr = query.entity_name
        let region_arr = query.region,
            bank_arr = query.bank_name
        let regex = new RegExp(["^", query.client_name, "$"].join(""), "i")
        let matchQuery = {
            "client_name": { $regex: regex },
            "region": { $in : region_arr },
            "bank_name": { $in: bank_arr }
        }
        for(let entity of entity_arr){
            matchQuery["entity_name"] = entity
            let temp = await accountService.getBalanceByGrouping(matchQuery, "region")
            if(temp)
                result.push({ entity_name: entity, region: temp.keys, available_balance: temp.sum })
        }
        // console.log(result)
        let final_result = []
 
        result.forEach(i => {
            let region_wise_balance = []
            for(let j = 0; j < i.region.length; j++){
                region_wise_balance.push({
                    region: i.region[j],
                    balance: i.available_balance[j]
                })
            }
            // console.log(bank_wise_balance)
            final_result.push({
                entity_name: i.entity_name,
                region_wise_balance
            })
        })
        console.log(final_result)
        return final_result
    }
    catch(err){
        console.log(err)
    }
}


// const getTransactionsDataByPayer = async (req, res) => {
//     try{
//         let payee = ['Emirates Telecom Receivables', 'Salary Payment', 'Emaar Properties Receivables', 'DP World Receivables' ]
//         let response = []
//         for(let data of payee){
//             let result = await accountTransService.getTransactionsDataByPayer(data)
//             response.push({ payee: data, banks: result[0] ? result[0].keys : [], transaction_sum: result[0] ? result[0].sum: [] })
//         }
//         console.log(response)
//         res.status(200).send(response)
//     }catch(err){
//         console.log(err)
//         res.status(500).send({
//             message: "Internal Server Error"
//         })
//     }
// }

const insertForecastData = async (req, res) => {
     try{
        const result = await accountTransService.createForecast(req.body)
        res.status(200).send(result)
    }catch(err){
        console.log(err)
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

const getPercentageChange = async (query) => {
    try{
        const prevBalance = await accountBalanceService.getAccountBalanceOnDate({ client_name: query.client_name, entry_date: query.start_date })
        const newBalance = await accountBalanceService.getAccountBalanceOnDate({ client_name: query.client_name, entry_date: query.end_date })
        return { percentage_change: ((newBalance - prevBalance)/prevBalance) * 100 } 
    } catch(err){
        console.log(err)
    }
}

const add = (x, y) => {
    return x + y;
}

module.exports = {
    getForecast,
    getTransactionsDataByBeneficiary,
    insertForecastData,
    add,
    getPercentageChange,
    getBalanceForStackedBar,
    getBalanceForHeatMap
}