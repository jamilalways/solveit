import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const EyeIcon = ({ open }) => (
  open ? (
    // Eye open - password visible
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    // Eye closed - password hidden
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
);

const Login = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Client' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) navigate('/dashboard');
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'register') setIsLoginTab(false);
  }, [user, navigate, location]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Switch tab and reset form completely
  const switchTab = () => {
    setIsLoginTab((prev) => !prev);
    setFormData({ name: '', email: '', password: '', role: 'Client' });
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    let res;
    if (isLoginTab) {
      res = await login(formData.email, formData.password);
    } else {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      res = await register(formData.name, formData.email, formData.password, formData.role);
    }

    setLoading(false);

    if (!res.success) {
      setError(res.message || (isLoginTab ? 'Login failed. Check your email and password.' : 'Registration failed. Please try again.'));
    } else if (!isLoginTab) {
      setSuccess('Account created! Redirecting to dashboard...');
    }
  };


  const inputClass =
    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {isLoginTab ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-1 text-center text-sm text-gray-500">
            {isLoginTab ? 'Sign in to your SolveIt account' : 'Join SolveIt today — free & fast'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            {/* Password field with show/hide toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {!isLoginTab && (
                <p className="mt-1 text-xs text-gray-400">Must be at least 6 characters.</p>
              )}
            </div>

            {!isLoginTab && (
              <div>
                <label className="block text-sm font-medium text-gray-700">I am a...</label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border"
                >
                  <option value="Client">Client (I need things solved)</option>
                  <option value="Solver">Solver (I want to solve problems)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  {isLoginTab ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLoginTab ? 'Sign in' : 'Create account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={switchTab}
            className="text-blue-600 hover:text-blue-500 font-medium text-sm"
          >
            {isLoginTab ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

