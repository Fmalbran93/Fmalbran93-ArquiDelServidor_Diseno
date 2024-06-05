import express from "express";
import { __dirname } from "./path.js";
import path from 'path';
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import routerProduct from "./Productos/productRoutes.js";
import routerViews from "./common/routes/views.routes.js";
import routerCart from "./Carritos/cartRoutes.js";
import socketProducts from "./Productos/Listeners/socketProducts.js";
import socketChat from "./Mensajes/Listeners/socketChat.js";
import "./config/database.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from 'connect-mongo'; // Importa connect-mongo
import mongoose from "mongoose"; // Asegúrate de importar mongoose
import { createRoles } from "./config/initialSetup.js";
import authRouter from "./Usuarios/userRoutes.js";
import cookieRouter from "./common/routes/cookies.routes.js";
import sessionRouter from "./common/routes/session.routes.js";
import { engine } from 'express-handlebars';

const app = express();
createRoles();
const PUERTO = 8080;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(cookieParser(process.env.SECRETCOOKIE));
app.use(bodyParser.urlencoded({ extended: true }))


// Crea una instancia de MongoStore utilizando la conexión de mongoose
const store = MongoStore.create({
  mongoUrl: "mongodb+srv://fmalbran93:coderhouse@clustercoder.nqsqgsl.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=ClusterCoder",
  collection: 'sessions' // Nombre de la colección para las sesiones
});

app.use(
session({
  secret: "SECRETSESSION",
  resave: true,
  saveUninitialized: true,
  store: store
})
);
 

app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'Common/Views/Layouts'),
  partialsDir: [
    path.join(__dirname, 'Productos/productViews'),
    path.join(__dirname, 'Usuarios/userViews'),
    path.join(__dirname, 'Carritos/cartViews'),
    path.join(__dirname, 'Mensajes/messageViews'),
    path.join(__dirname, 'common/views/Partials')
  ]
}));

app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'Views'));
app.use("/api/products", routerProduct);
app.use("/", routerViews);
app.use("/api/carts", routerCart);
app.use("/api/auth", authRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/session", sessionRouter);

app.get("/userProfile", (req, res) => {
  // Verifica si el usuario está autenticado
  if (req.isAuthenticated()) {
    // Renderiza la vista userProfile.handlebars y pasa los datos del usuario como contexto
    res.render("userProfile", { user: req.user });
  } else {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    res.redirect("/login");
  }
});

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


const socketServer = new Server(httpServer); // Creamos una nueva instancia de 'Server' con 'httpServer'

socketProducts(socketServer);
socketChat(socketServer);

