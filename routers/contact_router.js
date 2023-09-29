const express = require("express");
const ContactController = require("../controllers/contact_controller");
const AuthMiddleware = require("../middlewares/auth_middleware");

const contactRouter = express.Router();

contactRouter.use(AuthMiddleware.checkIfTokenIsPresent);

contactRouter
  .route("/")
  .get(ContactController.getAllContacts)
  .post(ContactController.createContact);
contactRouter
  .route("/:id")
  .patch(ContactController.checkIfIDExists, ContactController.updateAContact)
  .delete(ContactController.checkIfIDExists, ContactController.deleteAContact);

  module.exports = contactRouter;
