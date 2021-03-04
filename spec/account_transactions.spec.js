const { AccountTransactionService } = require('../services/account_transactions');
const accountTranService = AccountTransactionService.getInstance();

module.exports = function() {
    describe("Testing getTransactionList with valid account number", () => {
        var data;
        beforeAll(async (done) => {
            data = await accountTranService.getTransactionsByAccount({account_number:"1001"});
            //console.log("Data = ",data);
            done();
        },30000);
        
        it("validating response data", () => {
            expect(data.length).toBeGreaterThan(0);
        });
    });
    describe("Testing getTransactionList with invalid account number", () => {
        var data;
        beforeAll(async (done) => {
            data = await accountTranService.getTransactionsByAccount({account_number:"1001111111"});
            //console.log("Data = ",data);
            done();
        },30000);
        
        it("validating response data", () => {
            expect(data.length).toEqual(0);
        });
    });

    describe("Testing getTransactionByDate with valid start and end date", () => {
        var data;
        beforeAll(async (done) => {
            data = await accountTranService.getTransactionsByDate({"client_name":'deloitte middle east', start_date: "2019-08-20T08:55:53.242+00:00", end_date: "2019-08-27T08:55:53.242+00:00"});
            //console.log("Data = ",data);
            done();
        },30000);
        
        it("Validating Response Data", () => {
            expect(data.length).toBeGreaterThan(0);
        });
    });

    describe("Testing getTransactionByDate with invalid start and end date", () => {
        var data;
        beforeAll(async (done) => {
            data = await accountTranService.getTransactionsByDate({"client_name":'deloitte middle east', start_date: "2020-08-20T08:55:53.242+00:00", end_date: "2020-08-27T08:55:53.242+00:00"});
            //console.log("Data = ",data);
            done();
        },30000);
        
        it("Validating Response Data", () => {
            expect(data).toEqual([]);
        });
    });
};
