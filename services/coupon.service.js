const { coupons } = require("../data/coupons.data.js");

function normalizeCoupon(code) {
  if (!code) return null;
  return String(code).trim().toUpperCase();
}

function isExpired(expira) {
  if (!expira) return false;
  const today = new Date();
  const exp = new Date(expira + "T23:59:59");
  return exp < today;
}

function getCouponByCode(code) {
  const normalized = normalizeCoupon(code);
  if (!normalized) return null;

  const coupon = coupons.find((c) => c.code === normalized) || null;
  if (!coupon) return null;

  if (!coupon.activo) return { ...coupon, valido: false, motivo: "Cupón inactivo" };
  if (isExpired(coupon.expira)) return { ...coupon, valido: false, motivo: "Cupón expirado" };

  return { ...coupon, valido: true };
}

module.exports = { getCouponByCode, normalizeCoupon };
