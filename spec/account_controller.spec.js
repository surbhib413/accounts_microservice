var Request = require("request");

module.exports = function() {
    describe("Testing get Forecast",() => {
        var data = {};
        var expectedObj = {
            "_id": "5d6290bfcde50f1e7223ca43",
            "Payment Date": "2017-01-30T18:30:00.000Z",
            "Running Balance": "22616159.4605323",
            "Transaction Amount": "1",
            "Type": "Actual",
            "__v": 0
            }
        beforeAll((done) => {
            Request.get("http://localhost:2002/forecast", (error, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                //console.log("Body",data.body["data"]);
                done();
            });
        },30000);
        it("Testing Forecast status", () => {
            expect(data.status).toBe(200);
        });
        it("Testing Forecast Data", () => {
            expect(data.body["data"].length).toBeGreaterThan(0);
        });
        it("Testing Forecast Data with expected output", () =>{
            expect(data.body["data"]).toEqual(jasmine.arrayContaining([expectedObj]));
        })
    });

    describe("Testing Transactions Data By Beneficiary",() => {
        var data = {};
        var expectedObjArray = [{ beneficiary: 'Firm Services',
        banks: [ 'ADCB', 'FAB', 'ENBD' ],
        transaction_sum: [ 7409, 14818, 7409 ] },
      { beneficiary: 'Travel Expense',
        banks: [ 'ADCB', 'FAB' ],
        transaction_sum: [ 14818, 7409 ] },
      { beneficiary: 'Emirates Telecom Receivables',
        banks: [ 'ENBD', 'FAB' ],
        transaction_sum: [ 4000, 8000 ] },
      { beneficiary: 'Medical Insurance Payment',
        banks: [ 'FAB', 'ADCB' ],
        transaction_sum: [ 4000, 11000 ] },
      { beneficiary: 'Other Charges',
        banks: [ 'FAB', 'ENBD' ],
        transaction_sum: [ 4000, 4000 ] } ]; 
        beforeAll((done) => {
            Request.get("http://localhost:2002/top_beneficiary/data/", (error, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                //console.log("Body",data.body);
                done();
            });
        },30000);
        it("Testing response status", () => {
            expect(data.status).toBe(200);
        });
        it("Testing response data", () => {
            expect(data.body).not.toBeUndefined();
        });
        it("Testing response data with expected output", () => {
            expect(data.body).toEqual(expectedObjArray);
        });
    });
};