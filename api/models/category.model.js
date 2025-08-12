import connectDB from "../config/db/index.js";
import { generateUUID } from "../utils/uuid.js";

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i].categoryName.toLowerCase() < right[j].categoryName.toLowerCase()) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

class CategoryModel {
  // Create category
  static createCategory = async (categoryName, categoryDescription) => {
    const db = await connectDB();
    try {
      // generate a unique uuid for the category
      const categoryId = generateUUID();

      // create category
      const [result] = await db.execute(
        "INSERT INTO Categories (categoryId, categoryName, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
        [
          categoryId,
          categoryName,
          categoryDescription,
          Date.now().toString(),
          Date.now().toString(),
        ]
      );

      if (!result.affectedRows > 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.log("Error creating category", error);
      return false;
    } finally {
      if (db) db.release();
    }
  };

  static getCategoryById = async (categoryId) => {
    const db = await connectDB();
    try {
      const category = await db.execute(
        "SELECT * FROM Categories WHERE categoryId = ?",
        [categoryId]
      );

      return category[0];
    } catch (error) {
      console.log("error getting category by id", error);
    } finally {
      if (db) db.release();
    }
  };

  static getCategoryByName = async (categoryName) => {
    const db = await connectDB();
    try {
      const category = await db.execute(
        "SELECT * FROM Categories WHERE categoryName REGEXP ?",
        [categoryName]
      );

      return category[0];
    } catch (error) {
      console.log("error getting category by name", error);
    } finally {
      if (db) db.release();
    }
  };

  static getAllCategories = async () => {
    const db = await connectDB();
    try {
      const [categories] = await db.execute("SELECT * FROM Categories");

      const sortedCategories = mergeSort(categories);

      return sortedCategories;
    } catch (error) {
      console.log("error getting categories", error);
    } finally {
      if (db) db.release();
    }
  };
}

export { CategoryModel };
