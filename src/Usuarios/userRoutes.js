import { Router } from "express";
import userModel from "./user.model.js";
import rolesModel from "../common/models/role.model.js";
import { createHash } from "../Core/hash.js";

const authRouter = Router();

authRouter.post("/", async (req, res) => {
  const { name, surName, age, email, password, roles } = req.body;
  try {
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).send("El correo electronico ya esta registrado");
    }
    const newUser = await userModel.create({
      name,
      surName,
      age,
      email,
      password: createHash(password),
    });
    if (roles) {
      const foundRoles = await rolesModel.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await rolesModel.findOne({ name: "usuario" });
      newUser.roles = [role._id];
    }
    const savedUser = await newUser.save();
    req.session.user = {
      email: savedUser.email,
      name: savedUser.name,
      surname: savedUser.surName,
    };
    req.session.login = true;
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error al crear el usuario");
  }
});

export default authRouter;