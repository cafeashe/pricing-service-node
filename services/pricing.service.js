function calcularSubtotal(lineas) {
  // lineas: [{ sku, nombre, precio, cantidad, found }]
  return lineas.reduce((acc, l) => acc + l.precio * l.cantidad, 0);
}

function descuentoPorCategoria(categoria, subtotal) {
  // Reglas simples (tipo retail):
  // GOLD: 5% / SILVER: 3% / STANDARD: 0%
  const cat = String(categoria || "STANDARD").toUpperCase();

  if (cat === "GOLD") return { porcentaje: 5, monto: Math.round(subtotal * 0.05), detalle: "Cliente GOLD -5%" };
  if (cat === "SILVER") return { porcentaje: 3, monto: Math.round(subtotal * 0.03), detalle: "Cliente SILVER -3%" };

  return { porcentaje: 0, monto: 0, detalle: "Cliente STANDARD -0%" };
}

function descuentoPorCupon(coupon, subtotalDespuesCliente) {
  if (!coupon) return { monto: 0, detalle: "Sin cupón" };
  if (!coupon.valido) return { monto: 0, detalle: coupon.motivo || "Cupón inválido" };

  if (coupon.tipo === "PERCENT") {
    const monto = Math.round(subtotalDespuesCliente * (coupon.valor / 100));
    return { monto, detalle: `${coupon.code} -${coupon.valor}%` };
  }

  if (coupon.tipo === "FIXED") {
    // No puede descontar más que el subtotal actual
    const monto = Math.min(coupon.valor, subtotalDespuesCliente);
    return { monto, detalle: `${coupon.code} -$${coupon.valor}` };
  }

  return { monto: 0, detalle: "Cupón no soportado" };
}

function calcularQuote({ lineas, customer, coupon }) {
  const subtotal = calcularSubtotal(lineas);

  const descCliente = descuentoPorCategoria(customer.categoria, subtotal);
  const subtotalDespuesCliente = subtotal - descCliente.monto;

  const descCupon = descuentoPorCupon(coupon, subtotalDespuesCliente);
  const total = subtotalDespuesCliente - descCupon.monto;

  const descuentos = [];
  if (descCliente.monto > 0) descuentos.push({ tipo: "cliente", detalle: descCliente.detalle, monto: descCliente.monto });
  if (coupon && coupon.valido && descCupon.monto > 0) descuentos.push({ tipo: "cupon", detalle: descCupon.detalle, monto: descCupon.monto });

  return {
    subtotal,
    descuentos,
    total,
    moneda: "CLP",
  };
}

module.exports = { calcularQuote };
