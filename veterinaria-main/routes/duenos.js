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
    const { id } = req.params;
    const { nombre, telefono_dueno, email } = req.body;

    await pool.query(
        "UPDATE duenos SET nombre=?, telefono_dueno=?, email=? WHERE id_dueno=?",
        [nombre, telefono_dueno, email, id]
    )

    res.json({ message: "Dueño actualizado" })
})


module.exports = router;
