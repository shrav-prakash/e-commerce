const mongoClient = require('mongodb').MongoClient;
let db;

exports.mongoConnect = (callBack) => {
    mongoClient.connect(process.env.mongoURL).then(
        client => {
            console.log('Connected to database');
            db = client.db();
            callBack();
        }
    ).catch(
        err => {
            console.log(err);
        }
    )
};

exports.getDB = () => {
    if (db)
        return db;
    else
        throw 'No database found!';
}