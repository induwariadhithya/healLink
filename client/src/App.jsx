import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./theme.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import MoodTracker from "./pages/MoodTracker";
import Journal from "./pages/Journal";

// TODO (other members): import and add your pages here
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Stress from "./pages/Stress";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/mood-tracker" element={<MoodTracker />} />
        <Route path="/journal" element={<Journal />} />

        {/* Add teammates' routes below as they push their code */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/stress" element={<Stress />} /> */}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;