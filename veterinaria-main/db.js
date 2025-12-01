const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "Geraldine",
    password: "1234",
    database: "veterinaria"
});

(async () => {
    try {
        const conn = await pool.getConnection();
        console.log("conexion a sql exitosa");
        conn.release();
    } catch (error) {
        console.error("error al conectar a sql:", error);
    }
})();

module.exports = pool;
