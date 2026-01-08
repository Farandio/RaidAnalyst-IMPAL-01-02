import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import Profile from "./components/Profile";

import "./App.css";
import "./assets/background.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/"
          element={
            <div className="login-page">
              <LoginForm />
            </div>
          }
        />

        {/* HOME */}
        <Route path="/home" element={<Home />} />

        {/* PROFILE */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
