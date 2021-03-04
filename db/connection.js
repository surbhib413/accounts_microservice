const mongoose = require('mongoose')
require('dotenv').config()

const uri = process.env.DB_URL

mongoose.connect(uri, function (err) {
    if (err) {
        console.log('Some problem with the connection ' + err)
    }
    else {
        console.log('connected to db')
    }
})

exports.module = mongoose