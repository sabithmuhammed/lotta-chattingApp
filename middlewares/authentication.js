const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
        }
        console.log("hlooo", decoded);
        req.loggedUser = decoded.userId;
      });
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  authentication,
};
