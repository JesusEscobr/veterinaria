const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

// middlewares:
app.use(express.json())
app.use(cors())


const duenosRoutes = require("./routes/duenos")
const vetsRoutes = require("./routes/veterinarios")
const mascotasRoutes = require("./routes/mascotas")
const citasRoutes = require("./routes/citas")
const reporteRoutes = require("./routes/reportes")
app.use("/api/reportes", reporteRoutes)
app.use("/duenos", duenosRoutes);
app.use("/veterinarios", vetsRoutes);
app.use("/mascotas", mascotasRoutes);
app.use("/citas", citasRoutes);

// conexion a Mongo:
//mongoose.connect(process.env.MONGO_URI)
//    .then(() => console.log("Conectado a MongoDB"))
//    .catch((err) => console.log("Error al conectar a MongoDB", err))

//app.listen(process.env.PORT, () => {
//   console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
//})

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});