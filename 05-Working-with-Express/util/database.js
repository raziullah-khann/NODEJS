const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

// This function is used to establish a connection to the MongoDB database.
const mongoConnect = (callback) =>{
    MongoClient.connect("mongodb+srv://Raziullah-Khan:AXLIVFo3hpQp1jRF@cluster0.frgxn.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0").then(client => {
        console.log('Connected!');
        _db = client.db();
        callback();
    }).catch(err => {
        console.log(err);
        throw err;
    });
}

// This function returns the connected database instance
const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;