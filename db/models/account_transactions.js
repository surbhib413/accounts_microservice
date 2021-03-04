const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new mongoose.Schema({
    account_number: { type: String },
    client_name: { type: String },
    entity_name: { type: String },
    account_name: { type: String },
    transaction_date: { type: Date },
    payment_date: { type: Date },
    narrative: { type: String },
    tag:{ type:String },
    payment_mode: { type: String },
    transaction_ref: { type: String },
    bank_reference: { type: String },
    channel_reference: { type: String },
    transaction_type: { type: String },
    transaction_erp_code: { type: String },
    amount: { type: Number },
    debit: { type: Number },
    debit_currency: { type: String },
    debit_aed: { type: Number },
    credit: { type: Number },
    credit_currency: { type: String },
    credit_aed: { type: Number },
    amount_aed: { type: Number },
    available_balance: { type: Number },
    frozen_balance: { type: Number },
    running_balance_aed : { type: Number },
    beneficiary_name: { type: String },
    beneficiary_category: { type: String },
    payer_name: { type: String },
    payer_category: { type: String },
    conversion_rate: { type: Number },
    beneficiary_account_number: { type: String },
    beneficiary_account_name: { type: String },
    created_by: { type: String },
    customer_reference: { type: String },
    status: { type: String },
    debit_account_type: { type: String },
    debit_bank_name: { type: String },
    debit_branch_name: { type: String },
    type: { type: String }
}, { timestamps: true })


module.exports = mongoose.model('account_transactions', schema)