const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Cart {
  constructor(userId, id) {
    this.userId = userId;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("cart")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("cart").insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static findCartByUserId(userId) {
    const db = getDb();
    return (
      db
        .collection("cart")
        .findOne({ userId: userId })
        //   .toArray()
        .then((cart) => {
          //   console.log(cart);
          return cart;
        })
        .catch((err) => console.log(err))
    );
  }
}

module.exports = Cart;
