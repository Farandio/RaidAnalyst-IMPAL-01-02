const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const WebSocket = require("ws");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ==================== MIDDLEWARE ==================== */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ==================== DATABASE ==================== */
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "raidanalyst",
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

// 5. FORGOT PASSWORD
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email diperlukan" });
  }

  // Cek apakah email terdaftar
  db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Email tidak terdaftar" });
    }

    const userId = results[0].id;
    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam dari sekarang

    // Simpan token ke database
    const query = "INSERT INTO password_resets (user_id, reset_token, expires_at, used) VALUES (?, ?, ?, 0)";
    db.query(query, [userId, resetToken, expiresAt], (err) => {
      if (err) {
        console.error("Error saving reset token:", err);
        return res.status(500).json({ message: "Gagal membuat token reset" });
      }

      // MOCK EMAIL: Log token ke console
      console.log("\n========================================");
      console.log("🔐 PASSWORD RESET TOKEN");
      console.log("========================================");
      console.log(`Email: ${email}`);
      console.log(`Token: ${resetToken}`);
      console.log(`Expires: ${expiresAt.toLocaleString()}`);
      console.log("========================================\n");

      res.json({
        message: "Token reset password telah dibuat. Cek console server untuk mendapatkan token.",
        email: email
      });
    });
  });
});

// 6. RESET PASSWORD
app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token dan password baru diperlukan" });
  }

  // Validasi token
  const query = `
    SELECT pr.*, u.email 
    FROM password_resets pr 
    JOIN users u ON pr.user_id = u.id 
    WHERE pr.reset_token = ? AND pr.used = 0 AND pr.expires_at > NOW()
  `;

  db.query(query, [token], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Token tidak valid atau sudah kadaluarsa" });
    }

    const resetData = results[0];

    try {
      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password user
      db.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [hashedPassword, resetData.user_id],
        (err) => {
          if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({ message: "Gagal update password" });
          }

          // Tandai token sebagai sudah dipakai
          db.query(
            "UPDATE password_resets SET used = 1 WHERE id = ?",
            [resetData.id],
            (err) => {
              if (err) {
                console.error("Error marking token as used:", err);
              }

              console.log(`✅ Password berhasil direset untuk: ${resetData.email}`);
              res.json({ message: "Password berhasil diperbarui!" });
            }
          );
        }
      );
    } catch (err) {
      console.error("Bcrypt error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
});

// 7. GET USER BY ID
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID diperlukan" });
  }

  const query = "SELECT id, email, full_name, phone, address, bio, avatar, role, created_at FROM users WHERE id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(results[0]);
  });
});

// 8. UPDATE USER PROFILE
app.put("/api/user/update", (req, res) => {
  const { id, full_name, phone, address, bio, avatar } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID diperlukan" });
  }

  // Cek apakah user ada
  db.query("SELECT id FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Update profile
    const query = `
      UPDATE users 
      SET full_name = ?, phone = ?, address = ?, bio = ?, avatar = ?, updated_at = NOW() 
      WHERE id = ?
    `;

    db.query(query, [full_name, phone, address, bio, avatar, id], (err) => {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({ message: "Gagal update profile" });
      }

      console.log(`✅ Profile updated for user ID: ${id}`);
      res.json({ message: "Profile berhasil diperbarui!" });
    });
  });
});

