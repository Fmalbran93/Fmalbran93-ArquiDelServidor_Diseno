//Acá hacemos la conexión con MONGODB: 

//1) Instalamos mongoose: npm i mongoose. 
import mongoose from "mongoose";

//2) Crear una conexión con la base de datos

mongoose.connect("mongodb+srv://fmalbran93:coderhouse@clustercoder.nqsqgsl.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=ClusterCoder")
.then(() => {
console.log("Conexión exitosa a MongoDB");
}).catch((error) => {
console.log("Error en la conexión a MongoDB:", error);
});