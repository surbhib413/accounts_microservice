const graphql = require('graphql')
const { AccountService } = require('../services/accounts')
const accountCtrl = require('../services/account_controller')

const accountService = AccountService.getInstance()

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
} = graphql;

const AccountSchema = {
    account_number: { type: GraphQLString },
    client_name: { type: GraphQLString },
    entity_name: { type: GraphQLString },
    account_name: { type: GraphQLString },
    account_base_currency: { type: GraphQLString },
    account_type: { type: GraphQLString },
    bank_name: { type: GraphQLString },
    account_category: { type: GraphQLString },
    branch_name: { type: GraphQLString },
    iban: { type: GraphQLString },
    bic: { type: GraphQLString },
    status: { type: GraphQLString },
    overdraft_limit: { type: GraphQLFloat },
    previous_day_balance: { type: GraphQLFloat },
    available_balance: { type: GraphQLFloat },
    frozen_balance: { type: GraphQLFloat },
    balance_in_aed: { type: GraphQLFloat },
    createdAt: { type: GraphQLString },
}

const AccountDataSchema = {
    keys: { type: new GraphQLList(GraphQLString) },
    sum_values: { type: new GraphQLList(GraphQLFloat) },
    percentages: { type: new GraphQLList(GraphQLFloat) },
}

const AccountCountSchema = {
    bank_names: { type: new GraphQLList(GraphQLString) },
    counts: { type: new GraphQLList(GraphQLInt) },
    total_balances: { type: new GraphQLList(GraphQLFloat) },
}

const BankWiseType = new GraphQLObjectType({
    name: 'BankWiseType',
    fields: () => ({
        bank_name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    })
})

const RegionWiseType = new GraphQLObjectType({
    name: 'RegionWiseType',
    fields: () => ({
        region: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    })
})
const StackedBarDataSchema = {
    entity_name: { type: GraphQLString },
    // bank_name: { type: new GraphQLList(GraphQLString) },
    // available_balance: { type: new GraphQLList(GraphQLFloat) },
    bank_wise_balance: { type: new GraphQLList(BankWiseType) }
}

const HeatMapDataSchema = {
    entity_name: { type: GraphQLString },
    region_wise_balance: { type: new GraphQLList(RegionWiseType) }
}

const AccountType = new GraphQLObjectType({
    name: 'Account',
    fields: () => (AccountSchema)
});

const AccountDataType = new GraphQLObjectType({
    name: 'AccountData',
    fields: () => (AccountDataSchema)
})

const AccountCountType = new GraphQLObjectType({
    name: 'AccountCount',
    fields: () => (AccountCountSchema)
})

const StackedBarDataType = new GraphQLObjectType({
    name: 'StackedBarData',
    fields: () => (StackedBarDataSchema)
})

const HeatMapDataType = new GraphQLObjectType({
    name: 'HeatMapData',
    fields: () => (HeatMapDataSchema)
})

const getAccountsByClient = {
    type: new GraphQLList(AccountType),
    args: {
        client_name: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(args)
        return accountService.getAccountsByClient(args)
    }
}

const getAccountsDataByClient = {
    type: AccountDataType,
    args: {
        client_name: { type: GraphQLString },
        group: { type: GraphQLString },
        entity_name: { type: new GraphQLList(GraphQLString) },
        bank_name: { type: new GraphQLList(GraphQLString) },
        match_key: { type: GraphQLString },
        match_value: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(args)
        return accountService.getAccountsDataByClient(args)
    }
}

const getAccountsCountByClient = {
    type: AccountCountType,
    args: {
        client_name: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(args)
        return accountService.getAccountsCountByClient(args)
    }
}

// create new account
const addAccount = {
    type: AccountType,
    args: AccountSchema,
    resolve(parent, args) {
        // console.log(args)
        return accountService.createAccount(args)
    }
}

// get account by account number
const getAccount = {
    type: AccountType,
    args: {
        account_number: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(args)
        return accountService.getAccountByAccountNumber(args)
    }
}

const getBalanceForStackedBar = {
    type: new GraphQLList(StackedBarDataType),
    args: {
        client_name: { type: GraphQLString },
        entity_name: { type: new GraphQLList(GraphQLString) },
        bank_name: { type: new GraphQLList(GraphQLString) },
        region: { type: new GraphQLList(GraphQLString) }
    },
    resolve(parent, args) {
        return accountCtrl.getBalanceForStackedBar(args)
    }
}

const getBalanceForHeatMap = {
    type: new GraphQLList(HeatMapDataType),
    args: {
        client_name: { type: GraphQLString },
        entity_name: { type: new GraphQLList(GraphQLString) },
        bank_name: { type: new GraphQLList(GraphQLString) },
        region: { type: new GraphQLList(GraphQLString) }
    },
    resolve(parent, args) {
        return accountCtrl.getBalanceForHeatMap(args)
    }
}

module.exports = {
    getAccountsByClient,
    addAccount,
    getAccount,
    getAccountsDataByClient,
    getAccountsCountByClient,
    getBalanceForStackedBar,
    getBalanceForHeatMap
}