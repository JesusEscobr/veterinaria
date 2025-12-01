const express = require("express")
const router = express.Router()
const pool = require("../db")

// obtener duenos
router.get("/", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM duenos")
    res.json(rows);
})

// crear duenos
router.post("/", async (req, res) => {
    const { nombre, telefono_dueno, email } = req.body;
    const [result] = await pool.query(
        "INSERT INTO duenos (nombre, telefono_dueno, email) VALUES (?, ?, ?)",
        [nombre, telefono_dueno, email]
    );
    res.json({ id: result.insertId })
})

// actualizar duenos
router.put("/:id", async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
        const { nombre, telefono_dueno, email } = req.body;

        await conn.beginTransaction();

        // Bloqueo
        const [row] = await conn.query(
            "SELECT * FROM duenos WHERE id_dueno = ? FOR UPDATE",
            [id]
        );

        if (row.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "dueno no encontrado" });
        }

        await conn.query(
            "UPDATE duenos SET nombre=?, telefono_dueno=?, email=? WHERE id_dueno=?",
            [nombre, telefono_dueno, email, id]
        );

        await conn.commit();
        res.json({ message: "dueno actualizado" });

    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: "error al actualizar" });
    } finally {
        conn.release();
    }
});



module.exports = router;
