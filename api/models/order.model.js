import connectDB from "../config/db/index.js";

class OrderModel {
  static getAllUserOrders = async (userId) => {
    const db = await connectDB();
    try {
      const userOrders = await db.execute(
        "SELECT * FROM Orders JOIN OrderStatus ON Orders.orderId = OrderStatus.orderId JOIN OrderItems ON Orders.orderId = OrderItems.orderId JOIN Products ON OrderItems.productId = Products.productId WHERE Orders.userId = ? ORDER BY orderNumber DESC",
        [userId]
      );

      return userOrders[0];
    } catch (error) {
      console.log("error while getting user orders:", error);
    } finally {
      if (db) db.release();
    }
  };

  // update order status
  static updateOrderStatus = async (orderStatusId, status) => {
    const db = await connectDB();
    try {
      const [updatedOrderStatus] = await db.execute(
        "UPDATE OrderStatus SET status = ?, updatedAt = ? WHERE orderId = ?",
        [status, Date.now().toString(), orderStatusId]
      );

      if (updatedOrderStatus.affectedRow > 0) {
        return true;
      }

      return true;
    } catch (error) {
      console.log("error while updating", error);
    } finally {
      db.release();
    }
  };
}

export { OrderModel };
