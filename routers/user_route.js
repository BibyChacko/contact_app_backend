const express = require("express");
const userController = require("../controllers/user_controller");
const authMiddleware = require("../middlewares/auth_middleware");

const userRouter  = express.Router();

userRouter.post("/signup",userController.createUser);
userRouter.post("/login",userController.loginUser);
userRouter.route("/change_password")
            .post(authMiddleware.checkIfTokenIsPresent,userController.updatePassword);

userRouter.route("/update_user")
            .patch(authMiddleware.checkIfTokenIsPresent,userController.updateUser);

module.exports = userRouter;