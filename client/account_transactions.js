const graphql = require('graphql')
const { AccountTransactionService } = require('../services/account_transactions')


const accountTranService = AccountTransactionService.getInstance()

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
} = graphql;

const TransactionSchema2 = {
    account_number: { type: GraphQLString },
    client_name: { type: GraphQLString },
    entity_name: { type: GraphQLString },
    account_name: { type: GraphQLString },
    transaction_date: { type: GraphQLString },
    payment_date: { type: GraphQLString },
    narrative: { type: GraphQLString },
    tag:{type:GraphQLString},
    payment_mode: { type: GraphQLString },
    transaction_ref: { type: GraphQLString },
    bank_reference: { type: GraphQLString },
    channel_reference: { type: GraphQLString },
    transaction_type: { type: GraphQLString },
    transaction_erp_code: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    debit_currency: { type: GraphQLString },
    debit_aed: { type: GraphQLFloat },
    credit_currency: { type: GraphQLString },
    credit_aed: { type: GraphQLFloat },
    amount_aed: { type: GraphQLFloat },
    available_balance: { type: GraphQLFloat },
    frozen_balance: { type: GraphQLFloat },
    running_balance_aed: { type: GraphQLFloat },
    beneficiary_name: { type: GraphQLString },
    beneficiary_category: { type: GraphQLString },
    payer_name: { type: GraphQLString },
    payer_category: { type: GraphQLString },
    conversion_rate: { type: GraphQLFloat },
    beneficiary_account_number: { type: GraphQLString },
    beneficiary_account_name: { type: GraphQLString },
    created_by: { type: GraphQLString },
    customer_reference: { type: GraphQLString },
    status: { type: GraphQLString },
    debit_account_type: { type: GraphQLString },
    debit_bank_name: { type: GraphQLString },
    debit_branch_name: { type: GraphQLString },
    type: { type: GraphQLString }
}

const TransactionSchema = {
    amount: { type: GraphQLInt },
    transaction_date: { type: GraphQLString },
    narrative: { type: GraphQLString },
    payment_mode: { type: GraphQLString },
    tag:{type:GraphQLString},
    available_balance: {type:GraphQLString},
    type: {type:GraphQLString}
}

const TransactionDataSchema = {
    keys: { type: new GraphQLList(GraphQLString) },
    sum_values: { type: new GraphQLList(GraphQLFloat) },
    percentages: { type: new GraphQLList(GraphQLFloat) }
}

const AccountTransactionType = new GraphQLObjectType({
    name: 'AccountTransaction',
    fields: () => (TransactionSchema)
});

const TransactionDataType = new GraphQLObjectType({
    name: 'TransactionData',
    fields: () => (TransactionDataSchema)
})

// const AccountTransactionInputType = new GraphQLInputObjectType({
//     name: 'AccountTransactionInput',
//     fields: () => (TransactionSchema)
// });

// get account transaction by date
const getTransactionsByAccount = {
    type: new GraphQLList(AccountTransactionType),
    args: {
        account_number : { type: GraphQLID },
        type: { type: GraphQLString },
        start_date: { type: GraphQLString },
        end_date: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(args)
        return accountTranService.getTransactionsByAccount(args)
    }
}

const addTransaction = {
    type: AccountTransactionType,
    args: TransactionSchema,
    resolve(parent, args) {
        console.log(parent)
        return accountTranService.createTransaction(args)
    }
}

const getTransactionsByDate = {
    type: new GraphQLList(AccountTransactionType),
    args: {
        client_name: { type: GraphQLString },
        start_date: { type: GraphQLString },
        end_date: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(parent)
        return accountTranService.getTransactionsByDate(args)
    }
}

const getTransactionsDataByClient = {
    type: TransactionDataType,
    args: {
        type: { type: GraphQLString },
        client_name: { type: GraphQLString },
        group: { type: GraphQLString },
        match_key: { type: GraphQLString },
        match_value: { type: GraphQLString }
    },
    resolve(parent, args) {
        // console.log(args)
        return accountTranService.getTransactionsDataByClient(args)
    }
}

const getTransactionsDataByAccount = {
    type: TransactionDataType,
    args: {
        account_number: { type: GraphQLString },
        group: { type: GraphQLString }, // beneficiary or payer
        type: { type: new GraphQLList(GraphQLString) }, // entity_name
        sum: { type: GraphQLString } // debit_aed or credit_aed
    },
    resolve(parent, args) {
        // console.log(args)
        return accountTranService.getTransactionsDataByAccount(args)
    }
}

module.exports = {
    getTransactionsByAccount,
    addTransaction,
    getTransactionsByDate,
    getTransactionsDataByClient,
    getTransactionsDataByAccount
}