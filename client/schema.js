const graphql = require('graphql')
const { getTransactionsByAccount,
        addTransaction,
        getTransactionsByDate,
        getTransactionsDataByClient,
        getTransactionsDataByAccount } = require('./account_transactions')
const { getAccountsByClient,
        addAccount,
        getAccount, 
        getAccountsDataByClient, 
        getAccountsCountByClient,
        getBalanceForStackedBar,
        getBalanceForHeatMap } = require('./accounts')
const { addAccountBalance,
        getAccountsSumByDate,
        getPercentageChange,
        getAccountBalanceByDate } = require('./account_balance')

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
} = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getAccount,
        getAccountsByClient,
        getAccountsDataByClient,
        getAccountsCountByClient,
        getTransactionsByAccount,
        getTransactionsByDate,
        getTransactionsDataByClient,
        getTransactionsDataByAccount,
        getAccountsSumByDate,
        getAccountBalanceByDate,
        getPercentageChange,
        getBalanceForStackedBar,
        getBalanceForHeatMap
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTransaction,
        addAccount,
        addAccountBalance
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});