const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");
const User = require("../models/user");
const { ObjectId } = require("mongodb");

let userDetails = {
  username: "Ethan",
  password: "Matcha",
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  console.log("body", req.body);
  console.log("params", req.params);
  const prodId = req.params.productId;
  console.log("prodId", prodId);
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = async (req, res, next) => {
  // console.log(req.user.id);
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart
  //       .getProducts()
  //       .then((products) => {
  //         res.render("shop/cart", {
  //           path: "/cart",
  //           pageTitle: "Your Cart",
  //           products: products,
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .catch((err) => console.log(err));

  let userId = await User.findByUsername(userDetails.username).then((user) => {
    let id = user._id.toString();
    return id;
  });

  // console.log(userId);

  await Cart.findCartByUserId(userId).then((cart) => {
    // console.log(cart);
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  let fetchedCart;
  let newQuantity = 1;

  let userId = await User.findByUsername(userDetails.username).then((user) => {
    let id = user._id.toString();
    return id;
  });

  // console.log(userId);

  let userCart = await Cart.findCartByUserId(userId).then((response) => {
    // console.log(response, "I am inside psot Cart");
    if (!response) {
      const cart = new Cart(userId);
      cart.save();
    } else {
      let id = response._id.toString();
      return id;
    }
  });

  let cartItems = CartItem.fetchAll(userCart).then((response) => {
    response.forEach((item) => {
      if (item.productId === prodId) {
        item.quantity += 1;
      }
    });
    console.log(response);
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
