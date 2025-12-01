const express = require("express")
const router = express.Router()
const pool = require("../db")

// obtener citas
router.get("/", async (req, res) => {
    const [rows] = await pool.query(`
        SELECT c.*, d.nombre AS dueno, v.nombre AS veterinario
        FROM citas c
        JOIN duenos d ON c.id_dueno = d.id_dueno
        JOIN veterinarios v ON c.id_veterinario = v.id_veterinario
    `)
    res.json(rows)
});

// crear citas
router.post("/", async (req, res) => {
    const { fecha, hora, id_dueno, id_veterinario } = req.body

    const [result] = await pool.query(
        `INSERT INTO citas (fecha, hora, id_dueno, id_veterinario)
         VALUES (?, ?, ?, ?)`,
        [fecha, hora, id_dueno, id_veterinario]
    )
    res.json({ id: result.insertId })
});

// actualizar citas
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha, hora, id_dueno, id_veterinario } = req.body;

    await pool.query(
        `UPDATE citas
         SET fecha=?, hora=?, id_dueno=?, id_veterinario=?
         WHERE id_cita=?`,
        [fecha, hora, id_dueno, id_veterinario, id]
    )

    res.json({ message: "Cita actualizada" })
})

// borrar citas
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    await pool.query("DELETE FROM citas WHERE id_cita=?", [id])
    res.json({ message: "Cita eliminada" })
})

module.exports = router
