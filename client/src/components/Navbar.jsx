import { useState } from "react";
import { NavLink } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import "./Navbar.css";

// Simple leaf-shaped breathing dot used as the brand mark
const BrandMark = () => (
  <img src={logoImg} alt="HealLink logo" className="mb-navbar__logo" />
);

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/mood-tracker", label: "Mood Tracker" },
  { to: "/journal", label: "Journal" },
  { to: "/wellness-hub", label: "Wellness Hub" },
  { to: "/stress", label: "Stress Support" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="mb-navbar">
      <div className="mb-navbar__inner">
        <NavLink to="/" className="mb-navbar__brand" onClick={() => setOpen(false)}>
          <BrandMark />
          <span>HealLink</span>
        </NavLink>

        <nav className={`mb-navbar__links ${open ? "is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                "mb-navbar__link" + (isActive ? " is-active" : "")
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mb-navbar__actions">
          <NavLink to="/login" className="mb-navbar__ghost-btn">Log in</NavLink>
          <NavLink to="/register" className="mb-navbar__cta-btn">Get started</NavLink>
        </div>

        <button
          className="mb-navbar__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
