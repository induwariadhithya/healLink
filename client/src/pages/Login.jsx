import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      loginUser(res.data);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login to HealLink</h2>
        {error && <p className="error-msg">{error}</p>}
        
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
        <button type="submit" className="auth-btn">Login</button>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}