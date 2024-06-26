const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, password, id) {
    this.username = username;
    this.password = password;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      dbOp = db
        .collection("user")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("user").insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static findByUsername(username) {
    const db = getDb();
    return db
      .collection("user")
      .findOne({ username: username })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
