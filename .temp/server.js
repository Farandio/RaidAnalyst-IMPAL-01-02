const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
const PORT = 5000;

/* ==================== MIDDLEWARE ==================== */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ==================== DATABASE ==================== */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Kosongkan jika menggunakan XAMPP default
  database: "raidanalyst",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal: ", err);
    return;
  }
  console.log("✅ Terhubung ke Database MySQL");
});

/* ==================== WEBSOCKET ==================== */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ port: 8080 });
console.log(`🔗 WebSocket berjalan di ws://localhost:8080`);

/* ==================== API ROUTES ==================== */

// 1. LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0)
        return res.status(401).json({ message: "User tidak ditemukan" });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ message: "Password salah" });

      const { password_hash, ...userData } = user;
      res.json({ message: "Login Berhasil", user: userData });
    }
  );
});

// 2. REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hashed],
      (err) => {
        if (err)
          return res.status(400).json({ message: "Email sudah terdaftar" });
        res.status(201).json({ message: "User berhasil dibuat" });
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET SIGNALS (Ini yang memperbaiki error 404 Anda)
app.get("/api/signals", (req, res) => {
  const sql = "SELECT * FROM signals ORDER BY timestamp DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 4. RECEIVE SIGNAL FROM MT5 (POST)
app.post("/api/signals", (req, res) => {
  const {
    symbol,
    signal_type,
    entry_price,
    stop_loss,
    take_profit,
    status,
    direction,
    timestamp,
  } = req.body;
  const query = `INSERT INTO signals (symbol, signal_type, entry_price, stop_loss, take_profit, status, direction, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      symbol,
      signal_type,
      entry_price,
      stop_loss,
      take_profit,
      status,
      direction,
      timestamp,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: "Gagal simpan signal" });

      // Kirim update ke frontend via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "NEW_SIGNAL", data: req.body }));
        }
      });
      res.json({ success: true });
    }
  );
});
