var account_controller = require( './account_controller.spec.js' );
var account_transactions = require( './account_transactions.spec.js' );
var accounts = require( './accounts.spec.js' );

describe("Server", () => {
    var server;
    beforeAll(() => {
        server = require("../index");
    });
    afterAll(() => {
        server.close();
    });

    accounts();
    account_transactions();
    account_controller();
});
