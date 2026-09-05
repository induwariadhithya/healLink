import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import loginP2 from '../assets/images/login-slide-p2.jpeg';
import loginP3 from '../assets/images/login-slide-p3.jpg';
import loginP6 from '../assets/images/login-slide-p6.jpg';
import loginP5 from '../assets/images/login-slide-p5.jpg';
import './Login.css';

const LOGIN_IMAGES = [
  { src: loginP2, alt: 'A person meditating beside a calm lake' },
  { src: loginP3, alt: 'A peaceful meditation scene at sunset' },
  { src: loginP6, alt: 'A person finding stillness in nature' },
  { src: loginP5, alt: 'A quiet reflective moment surrounded by greenery' },
];

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const imageTimer = window.setInterval(() => {
      setImageIndex((currentIndex) => (currentIndex + 1) % LOGIN_IMAGES.length);
    }, 30000);

    return () => window.clearInterval(imageTimer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await API.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell" aria-label="HealLink sign in">
        <div className="login-story">
          <img
            key={LOGIN_IMAGES[imageIndex].src}
            className="login-story__image"
            src={LOGIN_IMAGES[imageIndex].src}
            alt={LOGIN_IMAGES[imageIndex].alt}
          />
          <div className="login-story__shade" />
          <div className="login-story__content">
            <span className="login-eyebrow">A softer way forward</span>
            <h1>Make space for how you feel.</h1>
            <p>Return to your private corner for reflection, gentle check-ins, and small steps that support your wellbeing.</p>
            <div className="login-note">
              <span className="login-note__dot" />
              <span>Your progress is private and yours to keep.</span>
            </div>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-panel__topline">
            <span className="login-mark">HL</span>
            <span>HealLink</span>
          </div>
          <div className="login-heading">
            <p className="login-kicker">Welcome back</p>
            <h2>Sign in to your space</h2>
            <p className="login-intro">Pick up where you left off, at your own pace.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <p className="error-msg" role="alert">{error}</p>}

            <label className="login-field">
              <span>Email address</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
                required
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </label>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot-link">Forgot password?</button>
            </div>

            <button type="submit" className="auth-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
              {!isSubmitting && <span aria-hidden="true">&#8594;</span>}
            </button>
          </form>

          <p className="auth-link">
            New to HealLink? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
      </main>
  );
}