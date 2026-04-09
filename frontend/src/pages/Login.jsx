import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const rememberMeFlag = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && rememberMeFlag) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleRememberMeChange = (checked) => {
    setRememberMe(checked);
    if (checked && formData.email) {
      localStorage.setItem('rememberedEmail', formData.email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.setItem('rememberMe', 'false');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setResetLoading(true);
    try {
      toast.success('Password reset link sent to your email');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch {
      toast.error('Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Login successful!');
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberMe', 'true');
      }
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center justify-center">
      <section className="hidden md:flex relative items-center justify-center overflow-hidden bg-[#eff4ff] h-screen">
        <div className="absolute inset-0 z-0">
          <img
            alt="University Dining Hall"
            className="w-full h-full object-cover grayscale-[20%] contrast-[110%]"
            data-alt="Modern high-end university cafeteria with minimalist wooden tables, bright natural sunlight streaming through large glass windows, and clean architecture."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuApCndf09R3n83lYQwqf6w6K03twoY6nN4gfh66rRStJUxnC_4sM12vvg_itpKq_L2Al-URfuP-r_G-pMQJfXn4GR5Y03AIj9YKeVMGBw9MNXCd2CQXWK8FqN5MiE3mmZRsypb4TdB_Wz7e5T8zY4Wb2h6s90ZMHfzFlVKwXf6m4NYezxNc3GRJP0PxyTFrlH024z7bARYGdnwq_Qt778g30APO15P2E_mQm4DqEJeo0mjLdU5gLWJFGN2LPqWykw2nHO4QYtTW3VCz"
          />
          <div className="absolute inset-0 bg-[#0056D2]/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e]/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 p-16 flex flex-col justify-end h-full w-full">
          <div className="max-w-md">
            <span className="font-headline font-extrabold text-white tracking-widest text-xs uppercase mb-4 block">Academic Excellence</span>
            <h2 className="font-headline text-4xl font-bold text-white mb-6 leading-tight">Elevating the campus dining experience.</h2>
            <p className="text-white/80 font-body text-lg">Freshly curated meals for the modern scholar, delivered across the SLIIT campus with precision and speed.</p>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#f8f9ff] h-screen">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#0056D2] via-[#FF7A00] to-[#A93802]">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>SQB</span>
              </div>
              <h1 className="font-headline text-2xl font-black text-primary tracking-tighter">SLIIT QuickBite</h1>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-[#0d1c2e] tracking-tight mb-2">Welcome Back</h2>
            <p className="text-[#475569] font-body">Sign in to your academic dining account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-headline font-bold text-xs uppercase tracking-widest text-[#475569] ml-1">Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737785] transition-colors group-focus-within:text-[#0056D2]">mail</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="quickbite@gmail.com"
                  className={`w-full pl-12 pr-4 py-4 bg-[#eff4ff] rounded-xl border border-[#c3c6d6] focus:outline-none focus:ring-2 focus:ring-[#0056D2]/20 font-body text-[#0d1c2e] placeholder-[#737785] transition-all ${
                    errors.email ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/30' : 'border-[#c3c6d6] focus:border-[#0056D2]'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block font-headline font-bold text-xs uppercase tracking-widest text-[#475569]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-primary font-headline font-bold text-xs uppercase tracking-widest hover:underline transition-all"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737785] transition-colors group-focus-within:text-[#0056D2]">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 bg-[#eff4ff] rounded-xl border border-[#c3c6d6] focus:outline-none focus:ring-2 focus:ring-[#0056D2]/20 font-body text-[#0d1c2e] placeholder-[#737785] transition-all ${
                    errors.password ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/30' : 'border-[#c3c6d6] focus:border-[#0056D2]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#737785] hover:text-[#0056D2] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-3 px-1">
              <input
                className="w-4 h-4 rounded text-[#0056D2] border-[#c3c6d6] focus:ring-[#0056D2]/20"
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => handleRememberMeChange(e.target.checked)}
              />
              <label className="text-sm font-body text-[#475569] select-none" htmlFor="remember">
                Remember this device
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0056D2] hover:bg-[#0045bb] text-white py-4 rounded-xl font-headline font-bold tracking-tight shadow-lg shadow-[#0056D2]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[#475569] font-body">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[#FF7A00] font-bold hover:underline">
                Register Now
              </Link>
            </p>
          </div>

          <div className="mt-24 flex flex-col items-center justify-center border-t border-[#c3c6d6]/10 pt-8">
            <div className="flex items-center gap-6 opacity-30 grayscale contrast-150">
              <span className="font-headline font-black tracking-tighter text-lg">SLIIT</span>
              <div className="h-4 w-[1px] bg-[#0d1c2e]" />
              <span className="font-headline font-bold text-xs uppercase tracking-[0.2em]">Academic Dining Services</span>
            </div>
            <p className="text-[10px] text-[#737785] mt-4 font-body uppercase tracking-widest">Secure University Portal</p>
          </div>
        </div>
      </section>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Reset Password</h2>
            <p className="text-sm text-slate-600 mb-4">Enter your email address and we&apos;ll send you a link to reset your password.</p>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Login;
