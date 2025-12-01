const express = require("express")
const router = express.Router()
const pool = require("../db")

// obtener veterinarios
router.get("/", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM veterinarios")
    res.json(rows);
})

// crear veterinarios
router.post("/", async (req, res) => {
    const { nombre, especialidad } = req.body;
    const [result] = await pool.query(
        "INSERT INTO veterinarios (nombre, especialidad) VALUES (?, ?)",
        [nombre, especialidad]
    )

    res.json({ id: result.insertId })
})

// actualizar veterinarios
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, especialidad } = req.body;

    await pool.query(
        "UPDATE veterinarios SET nombre=?, especialidad=? WHERE id_veterinario=?",
        [nombre, especialidad, id]
    )

    res.json({ message: "Veterinario actualizado" })
})


module.exports = router
