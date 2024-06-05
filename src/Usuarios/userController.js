import Role from "../common/models/role.model.js";
import userMongo from "../models/user.model.js";

export const signup = async (req, res) => {
    try {
      const { name, surname, email, age, password, roles } = req.body;
      const newUser = new userMongo({
        name,
        surname,
        email,
        age,
        password: await userMongo.encryptPassword(password),
      });
      
      console.log(newUser); // Agrega este registro para verificar newUser
      
      if (roles) {
        const foundRoles = await Role.find({ name: { $in: roles } });
        newUser.roles = foundRoles.map((role) => role._id);
      } else {
        const role = await Role.findOne({ name: "usuario" });
        newUser.roles = [role._id];
      }
      const saveUser = await newUser.save();
      req.session.user = {
        email: newUser.email,
        name: newUser.name,
      };
      req.session.login = true;
      console.log(saveUser);
      res.redirect("/login")
    } catch (error) {
      console.error(error);
      return res.status(403).json(error);
    }
  };
export const signin = async (req, res) => {
  try {
    const userFound = await userMongo
      .findOne({ email: req.body.email })
  
    if (!userFound)
      return res.status(401).json({ message: "Usuario no encontrado" });
    const matchPassword = await userMongo.comparePassword(
      req.body.password,
      userFound.password
    );
    if (!matchPassword)
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
      req.session.user = {
        email: newUser.email,
        name: newUser.name,
      };
    res.redirect("/userProfile");
  } catch (error) {
    console.error(error);
    return res.status(403).json(error);
  }
};