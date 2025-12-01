const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Reporte = require("../models/Reportemascotas")

// crear reporte :)
router.post("/crear", async (req, res) => {
    try {
        const nuevo = await Reporte.create({
            id_veterinario: req.body.id_veterinario,
            id_dueno: req.body.id_dueno,
            id_mascota: req.body.id_mascota,
            diagnostico: req.body.diagnostico,
            medicamentos: req.body.medicamentos,
            recomendaciones: req.body.recomendaciones
        });

        res.json({
            mensaje: "Reporte creado con éxito :D",
            reporte: nuevo
        });
    } catch (error) {
        console.log("Error en creación del reporte:", error);
        res.status(500).json({ error: "No se pudo crear el reporte" });
    }
})

// obtener todos los reportes:
router.get("/", async(req, res) => {
    const reportes = await Reporte.find()
    res.json(reportes)
})
// obtener reportes por dueño:
router.get("/dueno/:id", async(req, res) => {
    const reportes = await Reporte.find({id_dueno: req.params.id})
    res.json(reportes)
})

// obtener reportes por veterinario:
router.get("/vet/:id", async(req, res) => {
    const reportes = await Reporte.find({id_veterinario: req.params.id})
    res.json(reportes)
})

// obtener reportes por mascota:
router.get("/mascota/:id", async(req, res) => {
    const reportes = await Reporte.find({id_mascota: req.params.id})
    res.json(reportes)
})

// actualizar reporte:
router.put("/:id", async(req, res) => {
    try {
        const actualizado = await Reporte.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.json(actualizado)
    } catch {
        res.status(500).json({error: "No se pudo editar el reporte"})
    }
})

module.exports = router