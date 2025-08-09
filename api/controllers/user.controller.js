import bcrypt from "bcrypt";

import { UserModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProductModel } from "../models/product.model.js";
import { CategoryModel } from "../models/category.model.js";
import { imagesUpload, profileUpload } from "../utils/multerSetup.js";
import { ApiError } from "../utils/ApiError.js";

const generateAccessToken = async (userId) => {
  try {
    const user = await UserModel.getUserById(userId);

    const accessToken = await UserModel.generateAccessToken(user);

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access token"
    );
  }
};

const getAllUsers = asyncHandler(async (req, res) => {
  // get all users from db
  const users = await UserModel.getAllUsers();

  if (!users) {
    throw new ApiError(404, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { users: users }, "users fetched successfully"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // check if user is already registered
  const existingUser = await UserModel.getUserByEmail(email);

  // throw an error if users exists
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // if not user exists create new user
  const createdUser = await UserModel.createUser(email, username, password);

  const { password: pass, role, ...rest } = createdUser;

  if (!createdUser) {
    throw new ApiError(500, "something went wrong registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(409, "User with this email already exists"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "PLease provide email and password");
  }

  // check if the user exists
  const existUser = await UserModel.getUserForLogin(email);

  if (!existUser) {
    throw new ApiError(404, "User not found");
  }

  // check if the passwor is valid
  const isPasswordValid = await bcrypt.compare(password, existUser.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Inalid user credentials");
  }

  // if user is authenticated, create jwt token
  const { accessToken } = await generateAccessToken(existUser.userId);

  // get the user document ignoring the password and other fields
  const { password: pass, ...rest } = existUser;

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 86400000),
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token
    .json(
      new ApiResponse(
        200,
        {
          user: rest,
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

const updateUser = asyncHandler(async (req, res) => {
  let updateFields = req.body;

  if (
    updateFields.hasOwnProperty("oldPassword") &&
    updateFields.hasOwnProperty("newPassword")
  ) {
    const user = await UserModel.getUserById(req?.user.userId);

    const isPasswordValid = await bcrypt.compare(
      updateFields.oldPassword,
      user.password
    );

    // throw an error if the old password is not valid
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const hashedPassword = await bcrypt.hash(updateFields.newPassword, 10);

    // delete the old password and new password
    delete updateFields["oldPassword"];
    delete updateFields["newPassword"];

    updateFields["password"] = hashedPassword; // update the new hashed password field
  }

  const updatedUser = await UserModel.updateUser(
    req?.user?.userId,
    updateFields
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  const { password, role, ...rest } = updatedUser;

  return res
    .status(201)
    .json(new ApiResponse(201, { user: rest }, "User updated successfully"));
});

const getProducts = asyncHandler(async (req, res, next) => {
  // destructure the req query parameters
  const { productId, productName, categoryName, categoryId } = req.query;

  let products = {};

  // get the products by productId
  if (productId) {
    products = await ProductModel.getProductById(productId);
  }

  // get the products by productName
  if (productName) {
    products = await ProductModel.getProductsByName(productName);
  }

  // get products by categoryName
  if (categoryName) {
    products = await ProductModel.getProductsByCategoryName(categoryName);
  }

  // get product by category Id
  if (categoryId) {
    products = await ProductModel.getProductsByCategoryId(categoryId);
  }

  // get all products
  if (!productId && !productName && !categoryName && !categoryId) {
    products = await ProductModel.getAllProducts();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products: products },
        "products fetched successfully"
      )
    );
});

const getCategories = asyncHandler(async (req, res) => {
  const { categoryId, categoryName } = req?.query;

  let categories = {};

  // get the categories by categoryId
  if (categoryId) {
    categories = await CategoryModel.getCategoryById(categoryId);
  }

  // get the categories by categoryName
  if (categoryName) {
    categories = await CategoryModel.getCategory;
  }

  // get all categories
  if (!categoryId && !categoryName) {
    categories = await CategoryModel.getAllCategories();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categories: categories },
        "Categories fetched successfully"
      )
    );
});

// upload user images
const uploadUserProfile = asyncHandler(async (req, res) => {
  profileUpload.single("file")(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a valid image",
      });
    }

    res.status(201).json({
      message: "Image uploaded successfully",
    });
  });
});

// upload product and other images
const uploadOtherImages = asyncHandler(async (req, res) => {
  imagesUpload.single("file")(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a valid image",
      });
    }

    res.status(201).json({ message: "Image uploaded successfully" });
  });
});

export {
  registerUser,
  loginUser,
  updateUser,
  getProducts,
  getCategories,
  uploadUserProfile,
  uploadOtherImages,
  getAllUsers,
};
