import bcrypt from "bcrypt";
import { generateUUID } from "../utils/uuid.js";
import connectDB from "../config/db/index.js";

class UserModel {
  // generate access token using jsonwebtoken
  static generateAccessToken = async (user) => {
    const accessToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    return accessToken;
  };

  static createUser = async (email, username, password) => {
    const db = connectDB();
    try {
      // hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // generate a userId for the user
      const userId = generateUUID();

      // save the user in db
      const [result] = await db.execute(
        `INSERT INTO Users (userId, username, email, password, avatar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ${Date.now().toString()}, ${Date.now().toString()})`,
        [userId, username, email, hashedPassword, "noProfile.png"]
      );

      // if user is created successfully return the user
      if (result.affectedRows > 0) {
        const user = await this.getUserById();
      }
    } catch (error) {}
  };

  // get user by email
  static getUserByEmail = async (email) => {
    const db = await connectDB();
    try {
      const user = await db.query("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      if (!user) return null; // return null if user is not found with email
      return user[0][0];
    } catch (error) {
      console.log("Error getting user from db", error);
    } finally {
      if (db) db.release();
    }
  };

  // get user by userId
  static getUserById = async (userId) => {
    const db = await connectDB();
    try {
      const user = await db.query("SELECT * FROM Users WHERE userId = ?", [
        userId,
      ]);
      return user[0][0];
    } catch (error) {
      console.error("Error getting user from db", error);
    } finally {
      if (db) db.release();
    }
  };

  // get user info for login
  // critical function
  static getUserForLogin = async (email) => {
    const db = await connectDB();
    try {
      const user = await db.query("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      return user[0][0]; // return user info with credentials for verification purposes
    } catch (error) {
      console.log("Error getting user info: ", error);
    } finally {
      if (db) db.release();
    }
  };

  static updateUser = async (userId, updateFields = {}) => {
    const db = await connectDB();
    try {
      let sqlQuery = "UPDATE Users SET ";
      const sqlQueryData = [];
      Object.entries(updateFields).forEach(([key, value], index, array) => {
        sqlQuery += `${key} = ?, `;
        sqlQueryData.push(value);

        if (index === array.length - 1) {
          sqlQuery = sqlQuery + " updatedAt = ? WHERE userId = ?";
          sqlQueryData.push(Date.now().toString());
          sqlQueryData.push(userId);
        }
      });

      const [result] = await db.execute(sqlQuery, sqlQueryData);

      if (result.affectedRows > 0) {
        const updatedUser = this.getUserById(userId);
        return updatedUser;
      }
    } catch (error) {
      console.log("Error updating user: ", error.message);
    } finally {
      if (db) db.release();
    }
  };

  static getAllUsers = async () => {
    const db = await connectDB();
    try {
      const users = await db.query(
        "SELECT userId, avatar, username, email, role, createdAt, updatedAt FROM Users"
      );

      if (!users) return null;

      return db.release();
    } catch (error) {
      console.log("Error getting user from db", error);
    } finally {
      if (db) db.release();
    }
  };

  // delete the user from the database
  static deleteUserById = async (userId) => {
    const db = await connectDB();
    try {
      const res = await db.execute("DELETE FROM Users WHERE userId = ?", [
        userId,
      ]);

      if (res[0].affectedRows > 0) {
        return true;
      }
    } catch (error) {
      console.log("error deleting user:", error.message);
      return false;
    } finally {
      if (db) db.release();
    }
  };
}

export { UserModel };
