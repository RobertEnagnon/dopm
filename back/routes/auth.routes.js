const { verifySignUp, passport } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/refreshRights", controller.refreshRights);
  app.post("/api/auth/changeProfile", controller.changeProfile);
  app.post("/api/auth/forgetPassword", controller.forgetPassword);
  app.post("/api/auth/resetPasswordWithToken", controller.forgetPasswordWithToken);
  //app.post("/api/auth/forgetPassword/:token", controller.forgetPasswordWithToken);
  app.post("/api/auth/changePassword", controller.changePassword);
  app.post("/api/auth/imgProfile/:id", controller.imgProfile);
};
