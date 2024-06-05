import { Router } from "express";
import ProductManager from "../../Productos/productController.js";
import CartManager from "../../Carritos/cartController.js";
import { __dirname } from "../../path.js";

const routerViews = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

let cart = [];

// mostrar productos en http://localhost:8080
routerViews.get("/products", async (req, res) => {
  const listadeproductos = await productManager.getProductsView();
  res.render("home", { listadeproductos });
});

/* 
 //se asigna paginacion http://localhost:8080/?page=2,
 //se asigan rutas de categorias http://localhost:8080/?category=
 //se asignan rutas de limite http://localhost:8080/?limit=3
 //se asigna ordenamiento por precio http://localhost:8080/?sort=1 ----- http://localhost:8080/?sort=-1
 */
routerViews.get("/", async (req, res) => {
  try {
    let { limit, page, sort, category } = req.query;

    // Se crean las opciones
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 6,
      sort: { price: Number(sort) },
      lean: true,
    };

    // Se asigna un valor condicional para crear rutas de ordenamiento
    if (!(options.sort.price === -1 || options.sort.price === 1)) {
      delete options.sort;
    }

    // condiciones de las posibles rutas entre las opciones
    const links = (products) => {
      let prevLink;
      let nextLink;
      if (req.originalUrl.includes("page")) {
        prevLink = products.hasPrevPage
          ? req.originalUrl.replace(
              `page=${products.page}`,
              `page=${products.prevPage}`
            )
          : null;
        nextLink = products.hasNextPage
          ? req.originalUrl.replace(
              `page=${products.page}`,
              `page=${products.nextPage}`
            )
          : null;
        return { prevLink, nextLink };
      }

      if (!req.originalUrl.includes("?")) {
        prevLink = products.hasPrevPage
          ? req.originalUrl.concat(`?page=${products.prevPage}`)
          : null;
        nextLink = products.hasNextPage
          ? req.originalUrl.concat(`?page=${products.nextPage}`)
          : null;
        return { prevLink, nextLink };
      }

      prevLink = products.hasPrevPage
        ? req.originalUrl.concat(`&page=${products.prevPage}`)
        : null;
      nextLink = products.hasNextPage
        ? req.originalUrl.concat(`&page=${products.nextPage}`)
        : null;
      return { prevLink, nextLink };
    };

    // rutas de categoria de productos
    const categories = await productManager.categories();
    const result = categories.some((categ) => categ === category);
    if (result) {
      const products = await productManager.getProducts({ category }, options);
      const { prevLink, nextLink } = links(products);
      const {
        totalPages,
        prevPage,
        nextPage,
        hasNextPage,
        hasPrevPage,
        docs,
        page,
      } = products;
      if (page > totalPages)
        return res.render("notFound", { pageNotFound: "/products" });
      return res.render("products", {
        products: docs,
        totalPages,
        prevPage,
        nextPage,
        hasNextPage,
        hasPrevPage,
        prevLink,
        nextLink,
        page,
        cart: cart.length,
      });
    }

    // Paginacion
    const products = await productManager.getProducts({}, options);
    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } =
      products;
    const { prevLink, nextLink } = links(products);
    if (page > totalPages)
      return res.render("notFound", { pageNotFound: "/products" });
    return res.render("products", {
      products: docs,
      totalPages,
      prevPage,
      nextPage,
      hasNextPage,
      hasPrevPage,
      prevLink,
      nextLink,
      page,
      cart: cart.length,
    });
  } catch (error) {
    console.log(error);
  }
});

// Modal Carrito
routerViews.get("/products/inCart", async (req, res) => {
  const productsInCart = await Promise.all(
    cart.map(async (product, cart) => {
      const productDB = await productManager.getProductById(product._id);
      return { title: productDB.title, quantity: product.quantity, price: productDB.price };
    })
  );
  return res.send({ cartLength: cart.length, productsInCart });
});

// Boton agregar al carrito
routerViews.post("/products", async (req, res) => {
  try {
    const { product, finishBuy } = req.body;
    if (product) {
      if (product.quantity > 0) {
        const findId = cart.findIndex(
          (productCart) => productCart._id === product._id
        );
        findId !== -1
          ? (cart[findId].quantity += product.quantity)
          : cart.push(product);
      } else {
        return res.render("products", {
          message: "La cantidad debe ser mayor que 0",
        });
      }
    }
    if (finishBuy) {
      await cartManager.addCart(cart);
      cart.splice(0, cart.length);
    }
    return res.render("products");
  } catch (error) {
    console.log(error);
  }
});

// Carrito http://localhost:8080/carts/id
routerViews.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartManager.getCartById(cid);
    if (result === null || typeof result === "string")
      return res.render("notFound", { result: false, message: "Carrito no encontrado" });
    return res.render("cart", { result });
  } catch (err) {
    console.log(err);
  }
});

// Product Detail http://localhost:8080/product/idProducto
routerViews.get("/product/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const produ = await productManager.getProductById(pid)
    if (produ === null || typeof produ === "string")
      return res.render("notFound", { result: false, message: "producto no encontrado" });
    return res.render("ProductDetail", { produ });
  } catch (error) {
    console.log(err);
  }
});

// Real time products http://localhost:8080/realtimeproducts
routerViews.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

// Chat
routerViews.get("/chat", (req, res) => {
  res.render("chat");
});

// Listado de todos los carritoshttp://localhost:8080/carts
routerViews.get("/carts", async (req, res) => {
  try {
    const allCarts = await cartManager.getAllCarts(); // Supongamos que tienes un método en CartManager para obtener todos los carritos
    res.render("cartList", { carts: allCarts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar los carritos");
  }
});


// Inicio http://localhost:8080/home
routerViews.get("/home", async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(err);
  }
});

routerViews.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
});

routerViews.get("/register", (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
  }
});
routerViews.get("/userProfile", (req, res) => {
  try {
    if (req.session.login && req.session.user) {
      res.render("userProfile", { user: req.session.user });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
});


export default routerViews;