// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const WebSocket = require('ws');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Default XAMPP
  password: '',      // Default XAMPP (kosong)
  database: 'raidanalyst'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

// Create table if not exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS signals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  signal_type VARCHAR(50) NOT NULL,
  entry_price DECIMAL(12,5) NOT NULL,
  stop_loss DECIMAL(12,5) NOT NULL,
  take_profit DECIMAL(12,5) NOT NULL,
  status VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  timestamp DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table: ', err);
  } else {
    console.log('✅ Signals table ready');
  }
});

// ==================== ROUTES ====================

// POST - Receive signals from MT5
app.post('/api/signals', (req, res) => {
  const { 
    symbol, 
    signal_type, 
    entry_price, 
    stop_loss, 
    take_profit, 
    status, 
    direction, 
    timestamp 
  } = req.body;

  console.log('📨 Received signal:', { symbol, signal_type, status });

  const query = `
    INSERT INTO signals 
    (symbol, signal_type, entry_price, stop_loss, take_profit, status, direction, timestamp) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    symbol, signal_type, entry_price, stop_loss, 
    take_profit, status, direction, timestamp
  ], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: 'Failed to save signal' });
    }

    // Notify WebSocket clients about new signal
    if (wss) {
      const newSignal = {
        id: result.insertId,
        symbol, signal_type, entry_price, stop_loss, 
        take_profit, status, direction, timestamp
      };
      
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'NEW_SIGNAL',
            data: newSignal
          }));
        }
      });
    }

    res.json({ 
      success: true, 
      message: 'Signal saved successfully',
      id: result.insertId 
    });
  });
});

// GET - Get all signals
app.get('/api/signals', (req, res) => {
  const { symbol, status, limit = 50 } = req.query;
  
  let query = 'SELECT * FROM signals WHERE 1=1';
  const params = [];
  
  if (symbol) {
    query += ' AND symbol = ?';
    params.push(symbol);
  }
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY timestamp DESC LIMIT ?';
  params.push(parseInt(limit));
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch signals' });
    }
    
    res.json(results);
  });
});

// GET - Get active signals only
app.get('/api/signals/active', (req, res) => {
  const query = `
    SELECT * FROM signals 
    WHERE status IN ('PENDING', 'ACTIVE') 
    ORDER BY timestamp DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch active signals' });
    }
    
    res.json(results);
  });
});

// GET - Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Trading Signals API is running',
    timestamp: new Date().toISOString()
  });
});

// ==================== WEB SOCKET ====================

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('🔗 New WebSocket client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'CONNECTED',
    message: 'Connected to Trading Signals WebSocket'
  }));
  
  // Send latest active signals
  const query = `
    SELECT * FROM signals 
    WHERE status IN ('PENDING', 'ACTIVE') 
    ORDER BY timestamp DESC 
    LIMIT 20
  `;
  
  db.query(query, (err, results) => {
    if (!err && results.length > 0) {
      ws.send(JSON.stringify({
        type: 'INITIAL_SIGNALS',
        data: results
      }));
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/signals`);
  console.log(`   GET  http://localhost:${PORT}/api/signals`);
  console.log(`   GET  http://localhost:${PORT}/api/signals/active`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`🔗 WebSocket running on ws://localhost:8080`);
});