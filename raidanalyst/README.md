# 🧠🚀 RaidAnalyst: Sistem Keuangan Cerdas untuk Kontrak Digital

**RaidAnalyst** adalah platform inovatif yang dirancang untuk mempermudah pengambilan keputusan pada perdagangan kontrak digital 📈. Kami secara cerdas menggabungkan **analisis sentimen** dari berita keuangan *real-time* 📰 dengan kerangka **analisis teknikal** 📉 canggih untuk menghasilkan sinyal dan panduan *trading* yang akurat.

---

## Latar Belakang 🔙

Dinamika pasar finansial modern menuntut keputusan cepat berbasis data yang akurat. Namun, pedagang dan investor ritel seringkali kewalahan dengan kompleksitas analisis teknikal dan fundamental yang bergerak real-time. Oleh karena itu, diperlukan sebuah platform yang tidak hanya mengintegrasikan kedua jenis analisis tersebut menjadi sinyal yang mudah dipahami, tetapi juga menjamin keandalan dan keamanan data. Proyek website ini diinisiasi untuk menjembatani kesenjangan tersebut, sejalan dengan visi untuk menggunakan keahlian informatika guna memberikan manfaat konkret bagi masyarakat dalam pengambilan keputusan investasi.

---

## Konsep Proyek 🎯

Tujuan utama proyek ini adalah menjembatani kesenjangan antara informasi pasar yang melimpah dan kebutuhan keputusan *trading* yang cepat dan terinformasi. Kami fokus pada dua pilar utama:

1.  **Sistem Berita Keuangan Cerdas:** Mengumpulkan, memproses, dan menganalisis sentimen dari sumber berita finansial utama.
2.  **Analisis Teknikal Terintegrasi:** Menerapkan indikator teknikal untuk memvalidasi sentimen berita dan mengidentifikasi titik masuk/keluar pasar yang potensial.

---

## Fitur Utama 🌟

### Fitur Inti Platform

| Fitur | Deskripsi | Status |
| :--- | :--- | :--- |
| **1. Insight Fundamental** | 📡 News feed real-time dari NewsAPI untuk Forex & Gold | ✅ Done |
| **2. Sinyal Teknikal** | 💬 Pemberian informasi harga entry, stop loss, dan take profit | ✅ Done |
| **3. Real-time Updates** | 📊 WebSocket untuk update signal langsung tanpa refresh | ✅ Done |
| **4. Signal Performance** | 🔔 Tracking performa bulanan dengan win rate & PnL | ✅ Done |

### Fitur Keamanan & User Management

| Fitur | Deskripsi | Status |
| :--- | :--- | :--- |
| **Autentikasi** | 🔐 Login, Register dengan bcrypt password hashing | ✅ Done |
| **Reset Password** | 🔑 Forgot password dengan token verification | ✅ Done |
| **Protected Routes** | 🛡️ Halaman terproteksi, hanya bisa diakses setelah login | ✅ Done |
| **Profile Management** | 👤 View, update profile, upload/delete avatar | ✅ Done |
| **Logout** | 🚪 Logout dengan konfirmasi dan clear session | ✅ Done |

### Progress Pengembangan (PSPEC)

| Fase Fitur | Deskripsi | Status |
| :--- | :--- | :--- |
| **1.1 Persiapan Lingkungan** | 📡 Struktur folder proyek dan DB terkonfigurasi | ✅ Done |
| **1.2 Desain Skema DB** | 💬 Skema database final (users, signals, password_resets) | ✅ Done |
| **1.3 Pengembangan API** | 📊 REST API endpoints untuk auth, profile, signals | ✅ Done |
| **1.4 Pengembangan EA** | 🔔 Expert Advisor untuk analisis teknikal (MQL5) | ✅ Done |
| **1.5 Verifikasi Real-time** | 🖥️ Integrasi MT5 → API → DB dengan WebSocket | ✅ Done |
| **1.6 Frontend Dashboard** | 🎨 React dashboard dengan real-time updates | ✅ Done |
| **1.7 Security Enhancement** | 🔒 Environment variables, protected routes | ✅ Done |

---

## Tech Stack & Tools 🛠️

### Backend
- **Node.js** + **Express.js** - REST API server
- **MySQL** - Database management
- **WebSocket (ws)** - Real-time communication
- **bcrypt** - Password hashing & security
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI Library
- **React Router** - Client-side routing & navigation
- **WebSocket API** - Real-time signal updates
- **Lucide React** - Modern icon library
- **CSS3** - Styling & animations

### Integration
- **MetaTrader 5 (MT5)** - Trading platform integration
- **NewsAPI** - Real-time market news feed
- **phpMyAdmin** - Database management interface

---

## Kontribusi Anggota Kelompok 🤝

Proyek ini adalah hasil kolaborasi tim. Berikut pembagian tanggung jawab setiap anggota:

| Nama Anggota | NIM | GitHub Username | Fokus/Tanggung Jawab |
| :--- | :--- | :--- | :--- |
| **Farandio Alkhalid** | 1203230081 | `@Farandio` | Expert Advisor (MQL5) & MT5 Integration 🌐 |
| **Danendra Urdha B.C.H** | 1203230110 | `@Rendyurdha` | Frontend Development (React) 🧐 |
| **Muchammad Kevin Ardiansyah** | 1203230096 | `@kevindk2422` | Database Design & Management 🚦 |
| **Ramanda Rafky Muhammad Amin** | 1203230069 | `@ramandarafky` | Backend API Development 🚧 |

*Silakan cek riwayat **Commits** pada repository untuk melihat kontribusi detail setiap anggota!*

---

## Instalasi dan Penggunaan 🛠️

### Prerequisites
- **Node.js** v14 atau lebih baru
- **MySQL/XAMPP** untuk database
- **Git** untuk version control
- **MetaTrader 5** (opsional, untuk testing signal integration)

### Langkah-langkah Instalasi

#### 1. Clone Repository
```bash
git clone https://github.com/Farandio/RaidAnalyst-IMPAL-01-02.git
cd RaidAnalyst-IMPAL-01-02/raidanalyst
```

#### 2. Setup Database
**Menggunakan phpMyAdmin:**
1. Buka http://localhost/phpmyadmin
2. Create database baru dengan nama `raidanalyst`
3. Import file `raidanalyst.sql` yang ada di root folder

**Atau via Command Line:**
```bash
mysql -u root -p < raidanalyst.sql
```

#### 3. Setup Backend
```bash
cd backend
npm install
```

**Konfigurasi Environment:**
File `.env` sudah tersedia dengan konfigurasi default untuk XAMPP:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=raidanalyst
PORT=5000
```

> ⚠️ **PENTING:** File `.env` sudah ditambahkan ke `.gitignore`. Jangan commit file ini ke repository!

#### 4. Setup Frontend
```bash
# Kembali ke root folder raidanalyst
cd ..
npm install
```

---

## Cara Menjalankan Aplikasi 🚀

### Development Mode

Anda memerlukan **2 terminal** untuk menjalankan aplikasi:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

**Output yang diharapkan:**
```
✅ Terhubung ke Database MySQL
🚀 Server berjalan di http://localhost:5000
🔗 WebSocket berjalan di ws://localhost:8080
```

**Terminal 2 - Frontend Development Server:**
```bash
# Dari root folder raidanalyst
npm start
```

Browser akan otomatis membuka di `http://localhost:3000`

---

## Panduan Penggunaan Aplikasi 📖

### 1. Register & Login
1. **Buka aplikasi** di browser (http://localhost:3000)
2. **Klik "Create account"** untuk register
3. **Isi email & password** → Klik "Register"
4. **Login** dengan kredensial yang baru dibuat
5. Otomatis redirect ke **Dashboard**

### 2. Reset Password (Jika Lupa)
1. Klik **"Forgot password?"**
2. Masukkan **email** yang terdaftar
3. **Cek terminal backend** untuk mendapatkan reset token
4. Copy token yang muncul (format UUID)
5. Paste token + masukkan **password baru**
6. Klik **"Update Password"**
7. Login dengan password baru

### 3. Update Profile
1. Setelah login, klik **"My Account"** di header
2. Edit data:
   - Full Name
   - Phone Number
   - Bio
   - Address
3. **Upload foto** (opsional) - Klik "Change Photo"
4. Klik **"Save Changes"**
5. Refresh halaman untuk verifikasi data tersimpan

### 4. Monitoring Trading Signals
- **Signal otomatis muncul** real-time via WebSocket
- **Filter signal:**
  - By Type: ALL / BUY / SELL
  - By Status: ALL / PENDING / ACTIVE / CLOSED_TP / CLOSED_SL / FAILED
- **Pagination:** Klik "Show More Signals" untuk memuat lebih banyak data
- **Signal Detail:** Entry price, Stop Loss, Take Profit

### 5. Performance Tracking
- Scroll ke section **"Tracking Performance"**
- Lihat **PnL bulanan** (Profit/Loss per bulan)
- **Win Rate** otomatis terhitung
- **Total Trades** dan statistik lengkap

### 6. Market News
- Scroll ke section **"Market News Update"**
- Berita **Forex & Gold** dari NewsAPI
- Klik **"Read More"** untuk artikel lengkap

### 7. Logout
- Klik tombol **"Logout"** di header
- Konfirmasi logout
- Otomatis redirect ke halaman login

---

## API Endpoints Documentation 🔌

### Authentication
```
POST /login              - Login user
POST /register           - Register user baru
POST /forgot-password    - Request reset password token
POST /reset-password     - Reset password dengan token
```

### User Profile
```
GET  /api/user/:id       - Get user data berdasarkan ID
PUT  /api/user/update    - Update user profile data
```

### Trading Signals
```
GET  /api/signals        - Get semua trading signals
POST /api/signals        - Create new signal (dari MT5)
```

**Contoh Request POST Signal:**
```json
POST http://localhost:5000/api/signals
Content-Type: application/json

{
  "symbol": "XAUUSD",
  "signal_type": "NEW_SIGNAL",
  "entry_price": 2650.50,
  "stop_loss": 2655.00,
  "take_profit": 2640.00,
  "status": "PENDING",
  "direction": "SELL",
  "timestamp": "2026-01-08 11:00:00"
}
```

---

## Troubleshooting 🐛

### Backend tidak bisa connect ke database
**Error:** `ER_ACCESS_DENIED_ERROR`

**Solusi:**
- Pastikan XAMPP/MySQL sudah running
- Verifikasi kredensial di file `.env`
- Cek database `raidanalyst` sudah dibuat & di-import

### WebSocket tidak connect
**Error:** `WebSocket connection failed`

**Solusi:**
- Pastikan backend running di port **8080**
- Cek firewall tidak memblock port 8080
- Restart backend server

### Token reset password tidak muncul
**Solusi:**
- Cek **terminal backend**, bukan browser console
- Token akan muncul dengan format box berikut:
  ```
  ========================================
  🔐 PASSWORD RESET TOKEN
  ========================================
  Email: user@example.com
  Token: abc-123-xyz-456
  Expires: [timestamp]
  ========================================
  ```

### Port already in use
**Error:** `Port 5000 is already in use`

**Solusi:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Atau ubah PORT di file .env
```

---

## Security Features 🔒

Platform ini mengimplementasikan berbagai fitur keamanan:

- ✅ **Password Hashing** dengan bcrypt (10 rounds)
- ✅ **Environment Variables** untuk credential management
- ✅ **SQL Injection Protection** via prepared statements
- ✅ **CORS Configuration** untuk development
- ✅ **Protected Routes** dengan localStorage validation
- ✅ **Token Expiration** untuk reset password (1 jam)
- ✅ **Input Validation** di semua endpoint

### Recommendations untuk Production:
- [ ] Implementasi JWT untuk session management
- [ ] Rate limiting untuk mencegah brute force
- [ ] HTTPS untuk production deployment
- [ ] Email service untuk reset password (saat ini mock via console)
- [ ] Input validation & sanitization yang lebih ketat

---

## Struktur Folder 📁

```
raidanalyst/
├── backend/
│   ├── db/
│   │   └── raidanalyst.sql          # Backup database lama
│   ├── node_modules/
│   ├── .env                          # Environment config ⚠️ JANGAN COMMIT!
│   ├── package.json
│   └── server.js                     # Main backend server
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── background.css
│   ├── components/
│   │   ├── Home.js                   # Dashboard utama + WebSocket
│   │   ├── Home.css
│   │   ├── LoginForm.js              # Authentication forms
│   │   ├── LoginForm.css
│   │   ├── Profile.js                # User profile management
│   │   ├── Profile.css
│   │   └── ProtectedRoute.js         # Route protection
│   ├── App.js                        # Main routing
│   ├── App.css
│   └── index.js
├── .gitignore
├── package.json
├── raidanalyst.sql                   # Database schema terbaru
└── README.md
```

---

## Changelog 📝

### Version 2.0.0 (2026-01-08) - **Current**
- ✅ Added complete authentication system (login, register, forgot password)
- ✅ Added user profile management (view, update, avatar upload/delete)
- ✅ Added WebSocket real-time signal updates
- ✅ Added protected routes & logout functionality
- ✅ Migrated to environment variables (.env)
- ✅ Enhanced security features (bcrypt, token validation)
- ✅ Added performance tracking & analytics
- ✅ Integrated NewsAPI for market news

### Version 1.0.0
- Initial release with basic signal display

---

## Status Proyek 📊

**Status:** ✅ **ALL DONE** (Production Ready dengan minor improvements)

### Completed Features:
- ✅ Expert Advisor (MT5 Integration)
- ✅ Backend REST API
- ✅ Database Schema & Management
- ✅ Frontend Dashboard (React)
- ✅ Real-time WebSocket Integration
- ✅ Authentication & Authorization
- ✅ User Profile Management
- ✅ Performance Analytics
- ✅ Market News Integration

### Future Improvements:
- [ ] Email service untuk reset password (real email, bukan console)
- [ ] JWT token-based authentication
- [ ] Advanced charting & visualization
- [ ] Mobile responsive optimization
- [ ] Multi-language support
- [ ] Dark mode theme

---

## Learn More 📚

### Dokumentasi Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

**Available Scripts:**
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

Learn more: [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)

**React Documentation:** [https://reactjs.org/](https://reactjs.org/)

---

## Support & Contact 📧

Jika ada pertanyaan, masalah, atau saran:
- **Create Issue** di GitHub repository
- **Cek Commits** untuk melihat kontribusi detail
- **Contact:** Email ke salah satu contributor

---

*Kami berkomitmen untuk terus mengembangkan RaidAnalyst menjadi solusi yang powerful dan intuitif untuk trading decision support!* 🌟

**⚡ Quick Start Command:**
```bash
# Terminal 1 - Backend
cd backend && npm install && npm start

# Terminal 2 - Frontend
npm install && npm start
```

**🌐 Access Application:** http://localhost:3000

---

**© 2026 RaidAnalyst Team - Informatika Project**
