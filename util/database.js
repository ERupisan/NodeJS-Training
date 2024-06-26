const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://EthanRupisan:Matcha18@cluster0.kiytmof.mongodb.net/nodedb?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

//pyTau8nOTHya4u2E
//rain77

//mongodb+srv://rain77:<password>@cluster0.km8ou3n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// https://image.shutterstock.com/image-photo/book-260nw-732217162.jpg
