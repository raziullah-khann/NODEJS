const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) =>{
    MongoClient.connect("mongodb+srv://Raziullah-Khan:AXLIVFo3hpQp1jRF@cluster0.frgxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(client => {
        console.log('Connected!');
        callback(client);
    }).catch(err => {
        console.log(err);
    });
}

module.exports = mongoConnect;