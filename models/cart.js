const fs = require("fs");
const path = require("path");

const p = path.join(require.main.path, "data", "cart.json");

module.exports = class Cart {
  static addCart(id, productPrice, cb) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) console.log(err);

        cb();
      });
    });
  }

  static deleteProductById(productId, productPrice, cb) {
    fs.readFile(p, (err, contentFile) => {
      if (err) return;

      const cart = JSON.parse(contentFile);

      const product = cart.products.find((item) => item.id === productId);

      if (!product) return cb();

      cart.products = cart.products.filter((item) => item.id !== productId);
      cart.totalPrice = cart.totalPrice - Number(productPrice) * product.qty;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) console.log(err);

        cb();
      });
    });
  }

  static getCart(callBack) {
    fs.readFile(p, (err, contentFile) => {
      if (err) return callBack(null);

      callBack(JSON.parse(contentFile));
    });
  }
};
