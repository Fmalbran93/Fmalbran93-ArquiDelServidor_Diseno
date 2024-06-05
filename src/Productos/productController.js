import { productsModel } from "./productModel.js";

export default class ProductManager {
    // metodo para filtrar categorias - es mandado a llamar desde las vistas
    categories = async () => {
      try {
        const categories = await productsModel.distinct("category");
        return categories;
      } catch (err) {
        console.log(err);
        return err;
      }
    };
  
    // metodo para la paginacion y los productos
    getProducts = async (filter, options) => {
      try {
        return await productsModel.paginate(filter, options);
      } catch (err) {
        return err;
      }
    };
  
    // renderizar productos en la vista
    getProductsView = async () => {
      try {
        return await productsModel.find().lean();
      } catch (err) {
        return err;
      }
    };
  
    // metodo para obtener productos por id
    getProductById = async (id) => {
      try {
        return await productsModel.findById(id);
      } catch (err) {
        return { error: err.message };
      }
    };
  
    // metodo para agregar producto
    addProduct = async (product) => {
      try {
        await productsModel.create(product);
        return await productsModel.findOne({ title: product.title });
      } catch (err) {
        return err;
      }
    };
  
    // metodo para actualizar producto
    updateProduct = async (id, product) => {
      try {
        return await productsModel.findByIdAndUpdate(id, { $set: product });
      } catch (err) {
        return err;
      }
    };
  
    // metodo para borrar producto
    deleteProduct = async (id) => {
      try {
        return await productsModel.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    };
  }