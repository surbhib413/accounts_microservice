const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const graphqlHTTP = require('express-graphql')
const PROTO_PATH = __dirname + '/proto/auth.proto'

const schema = require('./client/schema')

require('./db/connection')

const port = process.env.PORT || 2002

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var auth_proto = grpc.loadPackageDefinition(packageDefinition).auth;

// var client = new auth_proto.AuthService('localhost:50051',
//     grpc.credentials.createInsecure());

// client.sayHello({ name: 'you' }, function (err, response) {
//     console.log('Greeting:', response.message);
// });

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Accept,Content-Length, X-Requested-With, X-PINGOTHER');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};
app.use(allowCrossDomain);

require('./route')(app)

// bind express with graphql
app.use('/graphql' , graphqlHTTP({
    // pass in a schema property
    schema: schema,
    graphiql: true
}));

app.get('/', (req, res) => {
    console.log('Account microservice')
    res.send('Account microservice')
})

// app.listen(port, () => console.log(`app listening on port ${port}!`))

var server = app.listen(port, () => console.log(`app listening on port ${port}!`));

module.exports = server;
