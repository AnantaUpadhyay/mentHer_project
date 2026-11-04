import React, { useContext, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Workspace from "./pages/Workspace";
import "./styles/index.css";
import "./styles/finish.css";
import "./styles/theme.css";
function Protected({ children }) {
  const { loading, user } = useContext(AuthContext);
  return loading ? (
    <div className="page-loading" role="status">
      Opening your workspace…
    </div>
  ) : user ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search]);
  return null;
}
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage signup />} />
        <Route
          path="/dashboard/*"
          element={
            <Protected>
              <Workspace />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
