// filter and rearranges the raw data of user placed orders
export const transformUserOrderData = (rawUserOrderData) => {
  return new Promise((resolve, reject) => {
    try {
      const filteredData = rawUserOrderData.reduce((result, order) => {
        // check if the orderId already exists if so push the order items to same orderId object
        const existingOrder = result?.find((o) => o.orderId === order.orderId);

        if (existingOrder) {
          existingOrder.items.push({
            productId: order.productId,
            productName: order.productName,
            image: order.image,
            rating: order.rating,
            description: order.description,
            vegetarian: order.vegetarian,
            price: order.price,
            quantity: order.quantity,
            categoryId: order.categoryId,
            createdAt: order.createdAt,
          });
        } else {
          result?.push({
            orderId: order.orderId,
            orderNumber: order.orderNumber,
            orderStatus: order.status,
            total: order.total,
            items: [
              {
                productId: order.productId,
                productName: order.productName,
                image: order.image,
                rating: order.rating,
                description: order.description,
                vegetarian: order.vegetarian,
                price: order.price,
                quantity: order.quantity,
                categoryId: order.categoryId,
                createdAt: order.createdAt,
              },
            ],
          });
        }

        return result;
      }, []);

      resolve(filteredData);
    } catch (error) {
      reject(error);
    }
  });
};

export const filterObject = (obj, filterFields = []) => {
  const filteredObject = Object.keys(obj).reduce((acc, key) => {
    if (filterFields.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

  return filteredObject;
};
