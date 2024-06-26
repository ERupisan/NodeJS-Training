const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class OrderItem {
  constructor(userId, createdAt, updatedAt, id) {
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("orderItem")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("orderItem").insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
}

module.exports = OrderItem;
