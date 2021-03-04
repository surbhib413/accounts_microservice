const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new mongoose.Schema({
    account_number: { type: String },
    client_name: { type: String },
    entity_name: { type: String },
    account_name: { type: String },
    account_base_currency: { type: String },
    account_type: { type: String },
    bank_name: { type: String },
    account_category: { type: String },
    branch_name: { type: String },
    iban: { type: String },
    bic: { type: String },
    status: { type: String },
    overdraft_limit: { type: Number },
    previous_day_balance: { type: Number },
    available_balance: { type: Number },
    frozen_balance: { type: Number },
    balance_in_aed: { type: Number }
}, { timestamps: true })


module.exports = mongoose.model('accounts', schema)