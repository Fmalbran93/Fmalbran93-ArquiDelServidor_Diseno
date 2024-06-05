import express from "express";
import { __dirname } from "./path.js";
import path from 'path';
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
import MongoStore from 'connect-mongo';
import { createRoles } from "./config/initialSetup.js";
import authRouter from "./Usuarios/userRoutes.js";
import cookieRouter from "./common/routes/cookies.routes.js";
import sessionRouter from "./common/routes/session.routes.js";
import exphbs from 'express-handlebars';

const app = express();
createRoles();
const PUERTO = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "src/public")));

app.use(bodyParser.json());
app.use(cookieParser(process.env.SECRETCOOKIE));
app.use(bodyParser.urlencoded({ extended: true }));

const store = MongoStore.create({
  mongoUrl: process.env.URI,
  collection: 'sessions'
});

app.use(
  session({
    secret: process.env.SECRETSESSION,
    resave: true,
    saveUninitialized: true,
    store: store
  })
);

const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'src/common/Views/Layouts'),
  partialsDir: path.join(__dirname, 'src/common/Views/Partials'),
  defaultLayout: 'main',
  extname: '.handlebars'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/common/Views'));

// Rutas
app.use("/api/products", routerProduct);
app.use("/", routerViews);
app.use("/api/carts", routerCart);
app.use("/api/auth", authRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/session", sessionRouter);

app.get("/userProfile", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("userProfile", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

const httpServer = app.listen(PUERTO, () => {
  console.log(`Listening on the port http://localhost:${PUERTO}`);
});

const socketServer = new Server(httpServer);
socketProducts(socketServer);
socketChat(socketServer);