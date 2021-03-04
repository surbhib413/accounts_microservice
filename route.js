const accountCtrl = require('./services/account_controller')

//console.log(accountCtrl)

const path = require('path');

module.exports = (app) => {
    app.post('/test/', accountCtrl.insertForecastData)

    app.get('/forecast/', accountCtrl.getForecast)

    app.get('/top_beneficiary/data/', accountCtrl.getTransactionsDataByBeneficiary)
    //app.get('/postforecast/',accountCtrl.test)


}