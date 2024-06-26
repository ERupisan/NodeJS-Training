const express = require("express");
const bodyParser = require("body-parser");
const adminRouter = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const errorController = require("./controllers/error");
const User = require("./models/user");

const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => console.log(err));
  next();
});

app.use("/admin", adminRouter);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  let userDetails = {
    username: "Ethan",
    password: "Matcha",
  };

  User.findByUsername(userDetails.username).then((response) => {
    if (!response) {
      const user = new User(userDetails.username, userDetails.password);

      user.save();
    }
  });

  console.log();
  app.listen(3000);
});
