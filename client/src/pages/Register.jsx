import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import moodImage from '../assets/images/mood-tracker.jpg';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      const res = await API.post('/auth/register', formData);
      setSuccess('Registration successful');
      login(res.data.user, res.data.token);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (err.request ? 'Cannot connect to the server. Start the backend and try again.' : 'Registration failed')
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-shell" aria-label="Create a HealLink account">
        <div className="register-panel">
          <div className="register-brand">
            <span className="register-mark">HL</span>
            <span>HealLink</span>
          </div>

          <div className="register-heading">
            <p className="register-kicker">Begin gently</p>
            <h1>Create your private space</h1>
            <p>Build a simple rhythm for checking in, reflecting, and caring for your wellbeing.</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {error && <p className="register-message register-message--error" role="alert">{error}</p>}
            {success && <p className="register-message register-message--success" role="status">{success}</p>}

            <label className="register-field">
              <span>What should we call you?</span>
              <input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoComplete="name"
                required
              />
            </label>

            <label className="register-field">
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

            <label className="register-field">
              <span>Create a password</span>
              <div className="register-password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="new-password"
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  className="register-password__toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button type="submit" className="register-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating your space...' : 'Create account'}
              {!isSubmitting && <span aria-hidden="true">&#8594;</span>}
            </button>
          </form>

          <p className="register-login-link">
            Already part of HealLink? <Link to="/login">Sign in</Link>
          </p>
        </div>

        <div className="register-story">
          <img src={moodImage} alt="A calm moment of self-care" />
          <div className="register-story__shade" />
          <div className="register-story__content">
            <span className="register-quote-mark">“</span>
            <blockquote>Small moments of awareness can change the way a whole day feels.</blockquote>
            <div className="register-story__rule" />
            <p>One quiet place for the thoughts, moods, and progress that matter to you.</p>
          </div>
          <div className="register-story__badge">
            <span>01</span>
            <span>your wellbeing, your pace</span>
          </div>
        </div>
      </section>
    </main>
  );
}