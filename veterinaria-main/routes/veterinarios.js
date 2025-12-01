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
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
        const { nombre, especialidad } = req.body;

        await conn.beginTransaction();

        const [row] = await conn.query(
            "SELECT * FROM veterinarios WHERE id_veterinario = ? FOR UPDATE",
            [id]
        );

        if (row.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Veterinario no encontrado" });
        }

        await conn.query(
            "UPDATE veterinarios SET nombre=?, especialidad=? WHERE id_veterinario=?",
            [nombre, especialidad, id]
        );

        await conn.commit();
        res.json({ message: "Veterinario actualizado" });

    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: "error al actualizar" });
    } finally {
        conn.release();
    }
});



module.exports = router
