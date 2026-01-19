const { getProductsForItems, decreaseStock } = require("../services/catalog.service.js");
const { getCustomerByRut } = require("../services/customer.service.js");
const { getCouponByCode } = require("../services/coupon.service.js");
const { calcularQuote } = require("../services/pricing.service.js");
const { createOrder, listOrders } = require("../services/order.service.js");

function quoteCheckout(req, res) {
  const { rutCliente, items, cupon } = req.body;

  if (!rutCliente || typeof rutCliente !== "string") {
    return res.status(400).json({ error: "rutCliente es obligatorio y debe ser texto." });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items debe ser un arreglo con al menos 1 producto." });
  }
  for (const it of items) {
    if (!it.sku || typeof it.sku !== "string") {
      return res.status(400).json({ error: "Cada item debe incluir sku (string)." });
    }
    if (typeof it.cantidad !== "number" || it.cantidad <= 0) {
      return res.status(400).json({ error: "Cada item debe incluir cantidad (number > 0)." });
    }
  }

  const customer = getCustomerByRut(rutCliente);
  if (!customer) return res.status(404).json({ error: "Cliente no encontrado." });
  if (String(customer.estado).toUpperCase() !== "ACTIVO") {
    return res.status(403).json({ error: "Cliente bloqueado o no habilitado para comprar." });
  }

  const productos = getProductsForItems(items);

  const faltantes = productos.filter((p) => !p.found);
  if (faltantes.length > 0) {
    return res.status(404).json({
      error: "Uno o más SKU no existen en catálogo.",
      faltantes: faltantes.map((f) => ({ sku: f.sku })),
    });
  }

  const sinStock = productos.filter((p) => p.cantidad > p.stock);
  if (sinStock.length > 0) {
    return res.status(409).json({
      error: "Stock insuficiente para uno o más productos.",
      sinStock: sinStock.map((p) => ({ sku: p.sku, stock: p.stock, solicitado: p.cantidad })),
    });
  }

  const lineas = productos.map((p) => ({
    sku: p.sku,
    nombre: p.nombre,
    precio: p.precio,
    cantidad: p.cantidad,
  }));

  const coupon = cupon ? getCouponByCode(cupon) : null;

  if (cupon && !coupon) return res.status(422).json({ error: "Cupón no existe." });
  if (coupon && coupon.valido === false) return res.status(422).json({ error: "Cupón inválido.", motivo: coupon.motivo });

  const quote = calcularQuote({ lineas, customer, coupon });

  return res.status(200).json({
    customer: { rut: customer.rut, categoria: customer.categoria },
    items: lineas,
    cupon: coupon ? { code: coupon.code, valido: coupon.valido } : null,
    ...quote,
  });
}

// NUEVO: confirmar compra (crea orden + descuenta stock)
function confirmCheckout(req, res) {
  const { rutCliente, items, cupon } = req.body;

  // Reutilizamos la lógica de quote (validaciones + pricing)
  const customer = getCustomerByRut(rutCliente);
  if (!customer) return res.status(404).json({ error: "Cliente no encontrado." });
  if (String(customer.estado).toUpperCase() !== "ACTIVO") {
    return res.status(403).json({ error: "Cliente bloqueado o no habilitado para comprar." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items debe ser un arreglo con al menos 1 producto." });
  }

  const productos = getProductsForItems(items);
  const faltantes = productos.filter((p) => !p.found);
  if (faltantes.length > 0) {
    return res.status(404).json({ error: "SKU no existe.", faltantes: faltantes.map((f) => ({ sku: f.sku })) });
  }

  const coupon = cupon ? getCouponByCode(cupon) : null;
  if (cupon && !coupon) return res.status(422).json({ error: "Cupón no existe." });
  if (coupon && coupon.valido === false) return res.status(422).json({ error: "Cupón inválido.", motivo: coupon.motivo });

  const lineas = productos.map((p) => ({
    sku: p.sku,
    nombre: p.nombre,
    precio: p.precio,
    cantidad: p.cantidad,
  }));

  const quote = calcularQuote({ lineas, customer, coupon });

  // Descontar stock (punto crítico)
  const stockResult = decreaseStock(items);
  if (!stockResult.ok) {
    if (stockResult.code === 409) {
      return res.status(409).json({
        error: "Stock insuficiente para uno o más productos.",
        sinStock: stockResult.sinStock.map((p) => ({ sku: p.sku, stock: p.stock, solicitado: p.cantidad })),
      });
    }
    return res.status(stockResult.code).json({ error: stockResult.error });
  }

  const order = createOrder({ customer, items: lineas, quote, coupon });

  return res.status(201).json(order);
}

// OPCIONAL útil: listar órdenes (para ver que se guardaron)
function getOrders(req, res) {
  return res.status(200).json(listOrders());
}

module.exports = { quoteCheckout, confirmCheckout, getOrders };
