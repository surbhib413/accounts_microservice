const { AccountService } = require('../services/accounts')
const accountService = AccountService.getInstance()

module.exports = function() {
        describe("Testing getAccountsList with valid client_name", () => {
            var data;
            beforeAll(async (done) => {
                data = await accountService.getAccountsByClient({"client_name":'deloitte middle east'});
                //console.log("Data = ",data);
                done();
            },30000);
              
            it("Testing Response data", () => {
                expect(data.length).toBeGreaterThan(0);
            });
        });
        describe("Testing getAccountsList with invalid client_name", () => {
            var data;
            beforeAll(async (done) => {
                data = await accountService.getAccountsByClient({"client_name":'xyz'});
                //console.log("Data = ",data);
                done();
            },30000);
              
            it("Testing Response data", () => {
                expect(data.length).toEqual(0);
            });
        });
    
        describe("Testing getAccountData without query parameters (All Bank)", () => {
            var data;
            beforeAll(async (done) => {
                data = await accountService.getAccountsDataByClient({client_name:'deloitte middle east'});
                //console.log("Data = ",data);
                done();
            },30000);
              
            it("Testing Response data", () => {
                expect(data).not.toBeUndefined();
            });
        });
    
        describe("Get Account Data Testing with query parameters ( bank_name = FAB )", () => {
            var expectedObj = { _id: 0,
                                keys:["audit & assurance","consulting"],
                                sum_values:[59053,22249],
                                percentages:[72.63412954170869,27.365870458291308]};
            var data;
            beforeAll(async (done) => {
                data = await accountService.getAccountsDataByClient({client_name:'deloitte middle east',group:'entity_name',match_key:'bank_name',match_value:'FAB'});
                //console.log("Data = ",data);
                done();
            },30000);
              
            it("Testing Response data with expected value", () => {
                expect(data).toEqual(expectedObj);
            });
        });
    
        describe("Get Account Data Testing with query parameters ( bank_name = ENBD )", () => {
            var expectedObj = { _id: 0,
                                keys:["deloitte shared service","tax"],
                                sum_values:[10000,63957],
                                percentages:[13.521370526116527,86.47862947388347]};
            var data;
            beforeAll(async (done) => {
                data = await accountService.getAccountsDataByClient({client_name:'deloitte middle east',group:'entity_name',match_key:'bank_name',match_value:'ENBD'});
                //console.log("Data = ",data);
                done();
            },30000);
              
            it("Testing Response data with expected value", () => {
                expect(data).toEqual(expectedObj);
            });
        });
    
        describe("Get Account Data Testing with invalid query parameters", () => {
            var data;
            beforeAll(async (done) => {
                data = await accountService.getAccountsDataByClient({client_name:'deloitte middle east',group:'entity_name',match_key:'bank_name',match_value:'SBI'});
                //console.log("Data = ",data);
                done();
            },30000);
              
            it("Testing Response data", () => {
                expect(data).toBeUndefined();
            });
        });

        describe("Testing getAccountsCount with valid client_name", () => {
            var data;
            beforeAll(async (done) => {
                data = await accountService.getAccountsCountByClient({"client_name":'deloitte middle east'});
                //console.log("Data = ",data);
                done();
            },30000);
              
            it("Testing Response data", () => {
               expect(data).not.toBeUndefined();
            });
        });

        describe("Testing getAccountsCount with invalid client_name", () => {
            var data;
            beforeAll(async (done) => {
                data = await accountService.getAccountsCountByClient({"client_name":'xyz'});
                //console.log("Data = ",data);
                done();
            },30000);
              
            it("Testing Response data", () => {
               expect(data).toBeUndefined();
            });
        });
};