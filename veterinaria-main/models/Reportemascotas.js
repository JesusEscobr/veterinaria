const mongoose = require("mongoose")

const ReporteSchema = new mongoose.Schema(
    {
    id_veterinario: {type: String, required:true},
    id_dueno: {type: String, required:true},
    id_mascota: {type: String, required:true},
    edad_mascota: String,
    diagnostico: String,
    medicamentos: String,
    recomendaciones: String
}, 
{strict: false}
)

ReporteSchema.index({id_mascota: 1})
ReporteSchema.index({id_dueno: 1})
ReporteSchema.index({id_veterinario: 1})

module.exports = mongoose.model("Reportemascotas", ReporteSchema, "reportesmascotas")