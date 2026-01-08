import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  /* ================= STATE ================= */
  const navigate = useNavigate();
  const [signals, setSignals] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // State untuk Pagination (Menampilkan 12 data awal)
  const [visibleCount, setVisibleCount] = useState(12);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    // 1. Fetch Signals
    fetch("http://localhost:5000/api/signals")
      .then((res) => res.json())
      .then((data) => {
        setSignals(data);
        setLoadingSignals(false);
      })
      .catch((err) => {
        console.error("Signal error:", err);
        setLoadingSignals(false);
      });

    // 2. Fetch News
    const apiKey = "53106df2307f48aba66aab9d0027e6fc";
    const newsUrl = `https://newsapi.org/v2/everything?q=forex+gold&apiKey=${apiKey}&pageSize=6`;

    fetch(newsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) {
          setNewsList(
            data.articles.map((item) => ({
              title: item.title,
              date: new Date(item.publishedAt).toLocaleDateString(),
              summary: item.description || "Click to read full market update.",
              sourceUrl: item.url,
            }))
          );
        }
        setLoadingNews(false);
      })
      .catch(() => setLoadingNews(false));

    // 3. WebSocket Connection untuk Real-time Signal Updates
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("✅ WebSocket connected - Real-time signals active");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "NEW_SIGNAL") {
          console.log("🔔 New signal received:", message.data);
          // Tambahkan signal baru ke state tanpa refresh
          setSignals((prevSignals) => [message.data, ...prevSignals]);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup: tutup WebSocket saat component unmount
    return () => {
      ws.close();
    };
  }, []);

  /* ================= LOGIKA PERFORMANCE ================= */
  const calculatePerformance = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const perfMap = months.map((m) => ({
      month: m,
      tpCount: 0,
      slCount: 0,
      trades: 0,
    }));

    signals.forEach((sig) => {
      if (sig.created_at) {
        const date = new Date(sig.created_at);
        const monthIndex = date.getMonth();
        if (sig.status === "CLOSED_TP") {
          perfMap[monthIndex].tpCount += 1;
          perfMap[monthIndex].trades += 1;
        } else if (sig.status === "CLOSED_SL") {
          perfMap[monthIndex].slCount += 1;
          perfMap[monthIndex].trades += 1;
        }
      }
    });

    return perfMap.map((m) => ({
      ...m,
      pnl: m.tpCount - m.slCount,
      winrate:
        m.trades > 0 ? ((m.tpCount / m.trades) * 100).toFixed(2) + "%" : "0%",
    }));
  };

  const performanceData = calculatePerformance();
  const totalTrades = performanceData.reduce((sum, m) => sum + m.trades, 0);
  const totalTP = performanceData.reduce((sum, m) => sum + m.tpCount, 0);
  const totalPnL = performanceData.reduce((sum, m) => sum + m.pnl, 0);
  const totalWinrate =
    totalTrades > 0 ? ((totalTP / totalTrades) * 100).toFixed(2) : "0.00";

  /* ================= LOGIKA FILTER & SORTING SIGNAL ================= */
  const processSignals = () => {
    const latestSetups = {};
    signals.forEach((sig) => {
      const uniqueKey = `${sig.symbol}-${sig.entry_price}`;
      if (!latestSetups[uniqueKey] || sig.id > latestSetups[uniqueKey].id) {
        latestSetups[uniqueKey] = sig;
      }
    });
    return Object.values(latestSetups);
  };

  // Objek urutan prioritas: ACTIVE/PENDING (1), sisanya (2)
  const statusPriority = {
    ACTIVE: 1,
    PENDING: 1,
    CLOSED_TP: 2,
    CLOSED_SL: 2,
    FAILED: 2,
  };

  const allFilteredSignals = processSignals()
    .filter((signal) => {
      const typeMatch = filterType === "ALL" || signal.direction === filterType;
      const statusMatch =
        filterStatus === "ALL" || signal.status === filterStatus;
      return typeMatch && statusMatch;
    })
    .sort((a, b) => {
      // Prioritaskan status ACTIVE/PENDING
      const priorityA = statusPriority[a.status] || 3;
      const priorityB = statusPriority[b.status] || 3;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // Jika prioritas sama, tampilkan yang ID-nya terbaru
      return b.id - a.id;
    });

  // Ambil hanya sejumlah data yang ditentukan visibleCount
  const displayedSignals = allFilteredSignals.slice(0, visibleCount);

  /* ================= LOGOUT HANDLER ================= */
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  /* ================= DATA BROKER ================= */
  const brokerList = [
    {
      name: "Exness",
      detail: "Spread rendah & eksekusi cepat.",
      url: "https://www.exness.com/",
    },
    {
      name: "XM Global",
      detail: "Bonus deposit melimpah & aman.",
      url: "https://www.xm.com/",
    },
    {
      name: "IC Markets",
      detail: "Broker ECN terbaik untuk scalping.",
      url: "https://www.icmarkets.com/",
    },
  ];

  return (
    <>
      <header className="main-header">
        <div className="header-left">
          <span className="logo-text">RaidAnalist</span>
        </div>
        <nav className="header-nav">
          <a href="#signals">Signals</a>
          <a href="#performance">Performance</a>
          <a href="#news">News</a>
          <a href="#brokers">Brokers</a>
        </nav>
        <div className="header-right">
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            My Account
          </button>
          <button className="profile-btn" onClick={handleLogout}>
            Logout
          </button>
          <span className="header-time">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </header>

      <div className="home-container">
        {/* SIGNAL SECTION */}
        <h1 className="section-title" id="signals">
          Live Trading Signals
        </h1>

        <div className="signal-filter">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setVisibleCount(12);
            }}
          >
            <option value="ALL">All Types</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setVisibleCount(12);
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PENDING">PENDING</option>
            <option value="CLOSED_TP">CLOSED TP</option>
            <option value="CLOSED_SL">CLOSED SL</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <div className="signal-grid">
          {displayedSignals.map((signal) => (
            <div
              key={signal.id}
              className={`signal-card status-${signal.status.toLowerCase()} ${signal.direction.toLowerCase()}`}
            >
              <div className="signal-header">
                <span className="signal-type">{signal.direction}</span>
                <span className={`status-badge ${signal.status.toLowerCase()}`}>
                  {signal.status}
                </span>
              </div>
              <h2>{signal.symbol}</h2>
              <div className="signal-info">
                <p>
                  <strong>Entry:</strong> {signal.entry_price}
                </p>
                <p>
                  <strong>SL:</strong> {signal.stop_loss}
                </p>
                <p>
                  <strong>TP:</strong> {signal.take_profit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Load More */}
        {visibleCount < allFilteredSignals.length && (
          <div
            className="load-more-container"
            style={{ textAlign: "center", marginTop: "30px" }}
          >
            <button
              className="profile-btn"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              style={{ padding: "12px 40px", fontSize: "16px" }}
            >
              Show More Signals
            </button>
          </div>
        )}

        {/* PERFORMANCE SECTION */}
        <h1
          className="section-title"
          id="performance"
          style={{ marginTop: "80px" }}
        >
          Tracking Performance
        </h1>
        <div className="performance-section">
          <table className="performance-table">
            <thead>
              <tr>
                <th>Month (2025)</th>
                <th>PnL (Net Status)</th>
                <th>Winrate</th>
                <th>Trades</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((row, index) => (
                <tr key={index}>
                  <td>{row.month}</td>
                  <td
                    className={row.pnl >= 0 ? "pnl-positive" : "pnl-negative"}
                  >
                    {row.pnl > 0 ? `+${row.pnl}` : row.pnl}
                  </td>
                  <td>{row.winrate}</td>
                  <td>{row.trades}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>TOTAL</td>
                <td className={totalPnL >= 0 ? "pnl-positive" : "pnl-negative"}>
                  {totalPnL}
                </td>
                <td className="winrate-positive">{totalWinrate}%</td>
                <td>{totalTrades}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* NEWS SECTION */}
        <h1 className="section-title" id="news" style={{ marginTop: "80px" }}>
          Market News Update
        </h1>
        <div className="news-grid">
          {loadingNews ? (
            <p>Loading news...</p>
          ) : (
            newsList.map((news, i) => (
              <div key={i} className="news-card">
                <span className="news-date">{news.date}</span>
                <h3>{news.title}</h3>
                <p>{news.summary}</p>
                <a
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="read-more"
                >
                  Read More
                </a>
              </div>
            ))
          )}
        </div>

        {/* BROKERS SECTION */}
        <h1
          className="section-title"
          id="brokers"
          style={{ marginTop: "80px" }}
        >
          Top Rated Brokers
        </h1>
        <div className="news-grid">
          {brokerList.map((broker, index) => (
            <div
              key={index}
              className="news-card broker-item"
              onClick={() => window.open(broker.url, "_blank")}
            >
              <h3 style={{ color: "#3b82f6" }}>{broker.name}</h3>
              <p>{broker.detail}</p>
              <span className="read-more">Visit Official Site →</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2 className="footer-logo">RaidAnalist</h2>
            <p className="footer-desc">
              Professional Trading Signals & Market Insights for Forex & Gold
              Traders.
            </p>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <button className="footer-link-btn">Trading Signals</button>
            <button className="footer-link-btn">Market News</button>
            <button className="footer-link-btn">Performance</button>
          </div>
          <div className="footer-links">
            <h4>Resources</h4>
            <a
              href="https://www.reuters.com/markets/"
              target="_blank"
              rel="noreferrer"
            >
              Reuters
            </a>
            <a
              href="https://www.investing.com/"
              target="_blank"
              rel="noreferrer"
            >
              Investing
            </a>
            <a
              href="https://www.forexfactory.com/"
              target="_blank"
              rel="noreferrer"
            >
              Forex Factory
            </a>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <span>Email: support@raidanalist.com</span>
            <span>Timezone: GMT +7</span>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} RaidAnalist — All Rights Reserved.
        </div>
      </footer>
    </>
  );
}

export default Home;
