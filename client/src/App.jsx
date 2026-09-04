import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./theme.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Journal from "./pages/Journal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood-tracker"
          element={
            <ProtectedRoute>
              <MoodTracker />
            </ProtectedRoute>
          }
        />
        <Route path="/journal" element={<Journal />} />
        {/* <Route path="/stress" element={<Stress />} /> */}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}


export default App;