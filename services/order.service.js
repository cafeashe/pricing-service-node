const { orders } = require("../data/orders.data.js");

function generateOrderId() {
  // simple y suficiente para demo
  return "ORD-" + Date.now();
}

function createOrder({ customer, items, quote, coupon }) {
  const order = {
    orderId: generateOrderId(),
    createdAt: new Date().toISOString(),
    customer: { rut: customer.rut, categoria: customer.categoria },
    items,
    coupon: coupon ? { code: coupon.code } : null,
    subtotal: quote.subtotal,
    descuentos: quote.descuentos,
    total: quote.total,
    moneda: quote.moneda,
    estado: "CONFIRMADA",
  };

  orders.push(order);
  return order;
}

function listOrders() {
  return orders;
}

module.exports = { createOrder, listOrders };
