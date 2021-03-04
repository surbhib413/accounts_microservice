const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schema = new mongoose.Schema({
        "Payment Date": { type: Date },
        "Running Balance": { type: String },
        "Transaction Amount": { type: String },
        "Type": { type: String }
})


module.exports = mongoose.model('forecast', schema)