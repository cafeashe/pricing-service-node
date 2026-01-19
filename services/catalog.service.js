const { catalog } = require("../data/catalog.data.js");

function getProductBySku(sku) {
  return catalog.find((p) => p.sku === sku) || null;
}

function getProductsForItems(items) {
  return items.map((item) => {
    const product = getProductBySku(item.sku);
    if (!product) {
      return { sku: item.sku, found: false, cantidad: item.cantidad };
    }

    return {
      sku: product.sku,
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      cantidad: item.cantidad,
      found: true,
    };
  });
}

// Reserva/Descuento simple de stock en memoria
function decreaseStock(items) {
  // Primero validar todo (para no descontar a medias)
  const productos = getProductsForItems(items);

  const faltantes = productos.filter((p) => !p.found);
  if (faltantes.length > 0) {
    return { ok: false, code: 404, error: "SKU no existe.", faltantes };
  }

  const sinStock = productos.filter((p) => p.cantidad > p.stock);
  if (sinStock.length > 0) {
    return { ok: false, code: 409, error: "Stock insuficiente.", sinStock };
  }

  // Si todo OK, descontar
  for (const it of items) {
    const product = getProductBySku(it.sku);
    product.stock -= it.cantidad;
  }

  return { ok: true };
}

module.exports = { getProductBySku, getProductsForItems, decreaseStock };
