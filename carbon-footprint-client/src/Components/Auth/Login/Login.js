import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from 'common/PageWrapper';

import {
  inputBase,
  inputDark,
  buttonBase,
  buttonGreen,
  heading,
  subheading,
  inputMail,
  inputPass,
  boxglow
} from '../../../utils/styles';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('😎');
        setError('');

        // ✅ Redirect after a short delay
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setSuccess('');
        setError(data.error || '❌ Login failed. Please try again.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setSuccess('');
      setError('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <PageWrapper backgroundImage="/images/register-bk.jpg">
      <div className={`${boxglow}`}>
        <h1 className={heading}>Login</h1>

        {success && <p className="text-green-500 text-sm text-center animate-pulse mb-2">{success}</p>}
        {error && <p className="text-red-600 text-sm text-center animate-bounce mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`${inputBase} ${inputMail}`}
            required
            autoComplete="email"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`${inputBase} ${inputPass}`}
            required
            autoComplete="current-password"
          />
          <button type="submit" className={`${buttonBase} ${buttonGreen}`}>Login</button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default Login;
