import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      loginUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register for HealLink</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Full Name" 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
          />
        </div>
        <button type="submit" className="auth-btn">Register</button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}