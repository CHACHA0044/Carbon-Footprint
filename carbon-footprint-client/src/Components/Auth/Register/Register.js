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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setError(data.error || '❌ Registration failed. Try again.');
        } else {
          setError('❌ Server error. Invalid response.');
        }
        setFormData({ name: '', email: '', password: '' });
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token || '');
      setSuccess('🥂 Welcome aboard!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('❌ Error:', error);
      setError('❌ Server error. Please try again.');
      setFormData({ name: '', email: '', password: '' });
    }
  };

  return (
    <PageWrapper backgroundImage="/images/register-bk.jpg">
      <div className={` ${boxglow}`}>
        <h1 className={heading}>
          Track. Reduce. Inspire
        </h1>

        <p className={subheading}>
          Build your carbon footprint journal with us.
        </p>

        {success && <p className="text-green-500 text-sm text-center animate-pulse mb-2">{success}</p>}
        {error && <p className="text-red-600 text-sm text-center animate-bounce mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className={`${inputBase} ${inputDark}`}
            required
            autoComplete="name"
            title="Used for your profile"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`${inputBase} ${inputMail}`}
            required
            autoComplete="email"
            title="We'll never spam you, trust me bro"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`${inputBase} ${inputPass}`}
            required
            autoComplete="new-password"
            title="Just for this app"
          />

          <button
            type="submit"
            className={`${buttonBase} ${buttonGreen}`}
          >
            Submit
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default Register;