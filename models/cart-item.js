const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class CartItem {
  constructor(quantity, cartId, productId) {
    this.quantity = quantity;
    this.cartId = cartId;
    this.productId = productId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("cartItem")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("cartItem").insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll(cartId) {
    const db = getDb();
    return db
      .collection("cartItem")
      .find({ cartId: cartId })
      .toArray()
      .then((items) => {
        // console.log(items);
        return items;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = CartItem;
