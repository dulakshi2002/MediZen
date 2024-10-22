import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.username.length < 8) {
      newErrors.username = 'Username must be at least 8 characters long';
    }
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setErrors({ server: 'Sign up failed. Please try again.' });
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setErrors({ server: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Name'
          id='name'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            id='password'
            className='bg-slate-100 p-3 rounded-lg w-full'
            onChange={handleChange}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-3 flex items-center'
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5 '>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      {errors.server && <p className='text-red-700 mt-5'>{errors.server}</p>}
    </div>
  );
}

