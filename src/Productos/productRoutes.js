import { Router } from "express";
import { __dirname } from "../path.js";
import ProductManager from "./productController.js";

const routerProduct = Router();
const productManager = new ProductManager();

routerProduct.put("/:pid", async (req, res) => {
  const updatedproduct = await productManager.updateProduct(req.params, req.body);
  res.json({ status: "success", updatedproduct });
});

routerProduct.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const deleteproduct = await productManager.deleteProduct(id);
  res.json({ status: "success", deleteproduct });
});

export default routerProduct;