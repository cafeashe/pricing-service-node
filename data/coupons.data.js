const coupons = [
  { code: "PRIMERA10", tipo: "PERCENT", valor: 10, activo: true, expira: "2030-12-31" },
  { code: "FALABELLA5000", tipo: "FIXED", valor: 5000, activo: true, expira: "2030-12-31" },
  { code: "OFF", tipo: "PERCENT", valor: 50, activo: false, expira: "2030-12-31" },
  { code: "VIEJO10", tipo: "PERCENT", valor: 10, activo: true, expira: "2020-01-01" } // expirado
];

module.exports = { coupons };
