const express = require("express")
const router = express.Router()
const pool = require("../db")

// obtener mascotas
router.get("/", async (req, res) => {
    const [rows] = await pool.query(`
        SELECT m.*, d.nombre AS dueno
        FROM mascotas m
        JOIN duenos d ON m.id_dueno = d.id_dueno
    `)
    res.json(rows)
});

// crear mascotas
router.post("/", async (req, res) => {
    const { nombre, tipo, edad, peso, id_dueno } = req.body;

    const [result] = await pool.query(
        `INSERT INTO mascotas (nombre, tipo, edad, peso, id_dueno)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, tipo, edad, peso, id_dueno]
    )
    res.json({ id: result.insertId })
});

// actualizar mascotas
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, tipo, edad, peso, id_dueno } = req.body;

    await pool.query(
        `UPDATE mascotas
         SET nombre=?, tipo=?, edad=?, peso=?, id_dueno=?
         WHERE id_mascota=?`,
        [nombre, tipo, edad, peso, id_dueno, id]
    )

    res.json({ message: "Mascota actualizada" })
})


module.exports = router
