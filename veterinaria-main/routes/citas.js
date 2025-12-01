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
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
        const { fecha, hora, id_dueno, id_veterinario } = req.body;

        await conn.beginTransaction();

        const [row] = await conn.query(
            "SELECT * FROM citas WHERE id_cita = ? FOR UPDATE",
            [id]
        );

        if (row.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        await conn.query(
            `UPDATE citas
             SET fecha=?, hora=?, id_dueno=?, id_veterinario=?
             WHERE id_cita=?`,
            [fecha, hora, id_dueno, id_veterinario, id]
        );

        await conn.commit();
        res.json({ message: "cita actualizada" });

    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: "error al actualizar cita" });
    } finally {
        conn.release();
    }
});


module.exports = router
