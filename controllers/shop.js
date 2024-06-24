const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log);
};

exports.getProduct = (req, res, next) => {
  // console.log("params", req.params);
  const prodId = req.params.productId;
  // console.log("prodId", prodId);
  Product.findByPk(prodId)
    .then((product) => {
      // console.log(product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "All Products",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      // fetchedCart = cart
      // fetchedCart.setProducts(null)
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  let fetchedCart;
  let newQuantity = 1;
  let cartId;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    CartItem.findOne({
      where: {
        productId: prodId,
      },
    }).then((cartItem) => {
      console.log(cartItem);
      cartItem.destroy();
      res.redirect("/cart");
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({ where: { userId } });

    const orderList = await Promise.all(
      orders.map(async (order) => {
        const product = await Product.findOne({
          where: { id: order.productId },
        });
        console.log(product.imageUrl);
        return {
          quantity: order.quantity,
          productImage: product.imageUrl,
          title: product.title,
          price: product.price,
          description: product.description,
        };
      })
    );

    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders: orderList,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postOrders = async (req, res, next) => {
  try {
    const user = req.user.id;

    const cart = await Cart.findOne({
      where: {
        userId: user,
      },
    });

    CartItem.findAll({
      where: {
        cartId: cart.id,
      },
    }).then((cartItems) => {
      cartItems.forEach((item) => {
        Order.create({
          quantity: item.quantity,
          productId: item.productId,
          userId: user,
        });

        item.destroy();
      });
    });
    cart.destroy();
    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
