const { customers } = require("../data/customers.data");

function getCustomerByRut(rut) {
  return customers.find((c) => c.rut === rut) || null;
}

module.exports = { getCustomerByRut };
