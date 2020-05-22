const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.WOO_URL,
  port: process.env.WOO_PORT,
  consumerKey: process.env.WOO_CONS_KEY,
  consumerSecret: process.env.WOO_CONS_SEC,
  version: process.env.WOO_VERSION
});


function getProducts() {
  return new Promise(async(resolve, reject) => {
    try {
      const response = await api.get("products", {
        per_page: 20, // 20 products per page
      });

      resolve(response.data)
    } catch (error) {
      reject(error);
    }
  });
}

function getWebHooks(id) {
  return new Promise(async(resolve, reject) => {
    try {
      const response = await api.get(`webhooks/${id}`);
      resolve(response)
    } catch (error) {
      reject(error);
    }
  });
}


module.exports = {
  getProducts,
  getWebHooks
}