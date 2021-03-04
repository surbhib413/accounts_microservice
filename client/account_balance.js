const graphql = require('graphql')
const { AccountBalanceService } = require('../services/account_balance')
const accountCtrl = require('../services/account_controller')

const accountBalanceService = AccountBalanceService.getInstance()

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
} = graphql;

const AccountBalanceSchema = {
    account_number: { type: GraphQLString },
    client_name: { type: GraphQLString },
    entity_name: { type: GraphQLString },
    account_name: { type: GraphQLString },
    account_base_currency: { type: GraphQLString },
    account_type: { type: GraphQLString },
    bank_name: { type: GraphQLString },
    account_category: { type: GraphQLString },
    branch_name: { type: GraphQLString },
    available_balance: { type: GraphQLFloat },
    entry_date: { type: GraphQLString }
}

const AccountBalanceDataSchema = {
    dates: { type: new GraphQLList(GraphQLString) },
    total_balances: { type: new GraphQLList(GraphQLFloat) }
}

const AccountBalanceType = new GraphQLObjectType({
    name: 'AccountBalance',
    fields: () => (AccountBalanceSchema)
});

const AccountBalanceDataType = new GraphQLObjectType({
    name: 'AccountBalanceData',
    fields: () => (AccountBalanceDataSchema)
})

const percentageChangeType = new GraphQLObjectType({
    name: 'PercentageChange',
    fields: () => ({
        percentage_change: { type: GraphQLFloat }
    })
})


const addAccountBalance = {
    type: AccountBalanceType,
    args: AccountBalanceSchema,
    resolve(parent, args) {
        // console.log(args)
        return accountBalanceService.createAccountBalance(args)
    }
}

// get total account balance datewise
const getAccountsSumByDate = {
    type: AccountBalanceDataType,
    args: {
        client_name: { type: GraphQLString },
        start_date: { type: GraphQLString },
        end_date: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(args)
        return accountBalanceService.getAccountsSumByDate(args)
    }
}

// get account balance by acoount numberdatewise
const getAccountBalanceByDate = {
    type: new GraphQLList(AccountBalanceType),
    args: {
        client_name: { type: GraphQLString },
        account_number: { type: GraphQLString },
        start_date: { type: GraphQLString },
        end_date: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(args)
        return accountBalanceService.getAccountBalanceByDate(args)
    }
}

// get percentage change
const getPercentageChange = {
    type: percentageChangeType,
    args: {
        client_name: { type: GraphQLString },
        account_number: { type: GraphQLString },
        start_date: { type: GraphQLString },
        end_date: { type: GraphQLString }
    },
    resolve(parent, args){
        return accountCtrl.getPercentageChange(args)
    }
}

module.exports = {
    addAccountBalance,
    getAccountsSumByDate,
    getPercentageChange,
    getAccountBalanceByDate
}