import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const user = localStorage.getItem("user");

    if (!user) {
        // Redirect ke login jika belum login
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
