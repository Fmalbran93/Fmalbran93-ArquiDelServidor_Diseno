import ProductManager from "../productController.js";
import { __dirname } from  "../../path.js";

const productManager = new ProductManager();

const socketProducts = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    const listadeproductos = await productManager.getProductsView();
    socketServer.emit("enviodeproducts", listadeproductos);
    socket.on("addProduct", async (obj) => {
      await productManager.addProduct(obj);
      const listadeproductos = await productManager.getProductsView();
      socketServer.emit("enviodeproducts", listadeproductos);
    });

    socket.on("deleteProduct", async (id) => {
      await productManager.deleteProduct(id);
      const listadeproductos = await productManager.getProductsView();
      socketServer.emit("enviodeproducts", listadeproductos);
    });
  });
};

export default socketProducts;