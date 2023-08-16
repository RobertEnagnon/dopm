const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const { passport } = require("./passport");

module.exports = {
  authJwt,
  verifySignUp,
  passport,

};
