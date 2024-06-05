import { Router } from "express";
import userModel from "../../Usuarios/user.model.js";
import { isValidPassword } from "../../Core/hash.js";

const sessionRouter = Router();

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      if (isValidPassword(password, user)) {
        req.session.login = true;
        req.session.user = {
          email: user.email,
          name: user.name,
          surname: user.surName,
        };
        res.redirect("/userProfile");
      } else {
        res.status(401).send("Contraseña no valida");
      }
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    res.status(400).send("Error al iniciar sesion");
  }
});

sessionRouter.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/login");
});

export default sessionRouter;