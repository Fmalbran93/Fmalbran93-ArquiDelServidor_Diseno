import MessageManager from "../messageController.js";

const message = new MessageManager();
const socketChat = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    console.log("conectado usuario con id: " + socket.id);
    socket.on("mensaje", async (info) => {
      await message.createMessage(info);
      socketServer.emit("chat", await message.getMessages());
    });

    socket.on("clearchat", async () => {
      await message.deleteAllMessages();
    });
    socket.on("nuevousuario", (usuario) => {
      socket.broadcast.emit("broadcast", usuario);
    });
  });
};

export default socketChat;