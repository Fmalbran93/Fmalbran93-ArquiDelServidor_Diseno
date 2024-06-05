import Role from "../common/models/role.model.js";

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([
      new Role({ name: "usuario" }).save(),
      new Role({ name: "moderador" }).save(),
      new Role({ name: "administrador" }).save(),
    ]);
    console.log(values);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};