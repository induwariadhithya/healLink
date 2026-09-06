import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mb-footer">
      <div className="mb-footer__inner">
        <div className="mb-footer__brand">
          <span className="mb-footer__title">HealLink</span>
          <p className="mb-footer__tagline">
            A small step toward your wellness, every day.
          </p>
        </div>

        <div className="mb-footer__cols">
          <div className="mb-footer__col">
            <h4>Platform</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/mood-tracker">Mood Tracker</Link>
            <Link to="/journal">Journal</Link>
            <Link to="/stress">Stress Support</Link>
            <Link to="/wellness-hub">Wellness Hub</Link>
          </div>

          <div className="mb-footer__col">
  <h4>Support</h4>
  <span className="mb-footer__muted">Help Center</span>
  <span className="mb-footer__muted">Contact Us</span>
  <span className="mb-footer__muted">Privacy Policy</span>
</div>

         
        </div>
      </div>

      <div className="mb-footer__bottom">
        <span>© {year} HealLink. Built with care for mental wellness.</span>
      </div>
    </footer>
  );
}
