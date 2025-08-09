import express from "express";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/user.validators.js";
import { validate } from "../validators/validate.js";
import {
  getCategories,
  getProducts,
  loginUser,
  registerUser,
  updateUser,
  uploadOtherImages,
  uploadUserProfile,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/jwt.authMiddleware.js";
import {
  getAllUserOrders,
  placeOrder,
} from "../controllers/order.controller.js";
import { productOrderValidator } from "../validators/order.validator.js";

const router = express.Router();

router.route("/upload-profile").post(verifyJwt, uploadUserProfile);
router.route("/upload-images").post(verifyJwt, uploadOtherImages);

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/updateuser").patch(validate, verifyJwt, updateUser);
router.route("/get-products").get(validate, verifyJwt, getProducts);
router.route("/get-categories").get(validate, verifyJwt, getCategories);
router.route("/order").get(validate, verifyJwt, getAllUserOrders);
router
  .route("/order")
  .post(productOrderValidator(), validate, verifyJwt, placeOrder);

export default router;
