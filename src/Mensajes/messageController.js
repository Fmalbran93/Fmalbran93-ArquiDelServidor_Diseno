import MessageModel from "./messageModel.js";
export default class messageManager {
    getMessages = async () => {
      try {
        return await MessageModel.find().lean();
      } catch (error) {
        console.log("Error al Guaradar mensajes", error);
        throw error;
      }
    };
  
    createMessage = async (message) => {
      if (message.user.trim() === "" || message.message.trim() === "") {
        return null;
      }
      try {
        return await MessageModel.create(message);
      } catch (error) {
        console.log("Error al guardar mensaje", error);
        throw error;
      }
    };
  
    deleteAllMessages = async () => {
      try {
        console.log("Borrando mensajes...");
        const result = await MessageModel.deleteMany({});
        console.log("Mensaje borrado:", result);
        return result;
      } catch (error) {
        console.error("Error al borrar mensajes:", error);
        return error;
      }
    };
  }