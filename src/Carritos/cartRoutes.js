import { Router } from "express";
import CartManager from "./cartController.js";
import ProductManager from "../Productos/productController.js";

const routerCart = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

routerCart.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const results = await Promise.all(
      products.map(async (product) => {
        const checkId = await productManager.getProductById(product._id);
        if (checkId === null || typeof checkId === "string") {
          return res
            .status(404)
            .send({
              status: "error",
              message: `The ID product: ${product._id} not found`,
            });
        }
      })
    );
    const check = results.find((value) => value !== undefined);
    if (check) return res.status(404).send(check);
    const checkIdCart = await cartManager.getCartById(cid);
    if (checkIdCart === null || typeof checkIdCart === "string")
      return res
        .status(404)
        .send({ status: "error", message: `The ID cart: ${cid} not found` });
    const cart = await cm.updateProductsInCart(cid, products);
    return res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
  }
});

export default routerCart;