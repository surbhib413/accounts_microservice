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
    available_balance: { type: Number },
    entry_date: { type: Date }
})


module.exports = mongoose.model('account_balance', schema)