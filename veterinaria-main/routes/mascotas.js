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
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
        const { nombre, tipo, edad, peso, id_dueno } = req.body;

        await conn.beginTransaction();

        const [row] = await conn.query(
            "SELECT * FROM mascotas WHERE id_mascota = ? FOR UPDATE",
            [id]
        );

        if (row.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "mascota no encontrada" });
        }

        await conn.query("SELECT SLEEP(15)");

        await conn.query(
            `UPDATE mascotas 
             SET nombre=?, tipo=?, edad=?, peso=?, id_dueno=?
             WHERE id_mascota=?`,
            [nombre, tipo, edad, peso, id_dueno, id]
        );

        await conn.commit();
        res.json({ message: "mascota actualizada" });

    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ error: "error al actualizar mascota" });
    } finally {
        conn.release();
    }
});



module.exports = router
