import sqlite3 from 'sqlite3';

const dbName = 'database.db';

const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error("Error al conectar a la base de datos", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite.");
    }
});

// Crear la tabla de usuarios si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

    // Crear la tabla de citas si no existe
    // aca es otra
    /*
    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
    `);
    */
});

export default db;