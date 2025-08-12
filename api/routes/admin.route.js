import express from "express";

import { verifyJwt } from "../middlewares/jwt.authMiddleware.js";
import { verifyAdmin } from "../middlewares/admin.authMiddleware.js";
import { getAllUsers } from "../controllers/user.controller.js";
import { productValidator } from "../validators/product.validators.js";
import {
  createCategory,
  createProduct,
  deleteProduct,
  deleteUser,
  updateProduct,
} from "../controllers/admin.controller.js";
import { updateOrderStatus } from "../controllers/order.controller.js";
import { validate } from "../validators/validate.js";

const router = express.Router();

router.route("/get-all-users").get(verifyJwt, verifyAdmin, getAllUsers);
router.route("/user/:userId").delete(verifyJwt, verifyAdmin, deleteUser);

// product routes
router
  .route("/create-category")
  .post(validate, verifyJwt, verifyAdmin, createCategory);
router
  .route("/create-product")
  .post(productValidator(), validate, verifyJwt, verifyAdmin, createProduct);
router
  .route("/update-product/:productId")
  .patch(validate, verifyJwt, verifyAdmin, updateProduct);
router
  .route("/delete-product/:productId")
  .delete(verifyJwt, verifyAdmin, deleteProduct);
router
  .route("/update-order-status")
  .patch(validate, verifyJwt, verifyAdmin, updateOrderStatus);

export default router;
