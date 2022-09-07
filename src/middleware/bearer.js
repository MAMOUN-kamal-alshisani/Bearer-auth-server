// const USERS = require("../modules/schema");
//// 
module.exports = (user) =>
  function bearerAuth(req, res, next) {
    if (!req.headers.authorization) {
      console.log("no authorization header found - jwt");

      next("indvalid logIn");

      return;
    }

    let token = req.headers.authorization.split(" ").pop();

    user
      .authenticateBearer(token)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => next(err));
  };

// module.exports = bearerAuth
