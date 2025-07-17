import API from 'api/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');
  try {
    const { data } = await API.post('/auth/login', formData);

    // saving token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setSuccess('😎');
    setError('');

    // redirect after a short delay
    setTimeout(() => navigate('/dashboard'), 500);
  } catch (err) {
    console.error('❌ Login error:', err);
    if (err.response?.data?.error){
      setError(err.response.data.error);
    } else {
      setError('❌ Something went wrong. Please try again.');
    }
  }finally {
    setLoading(false);
  }
};

  return (
  <motion.div
        initial={{ x:100, opacity: 0}}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="w-full h-full"
      >
    
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
          <button
  type="submit"
  disabled={loading}
  className={`${buttonBase} ${buttonGreen} flex items-center justify-center gap-2 active:scale-75`}
>
  {loading ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Logging in...
    </>
  ) : success
  ? (
    'Login Successful'
  )
  : 'Submit'
}
</button>

        </form>
      </div>
    
    </motion.div>
  );
};

export default Login;
