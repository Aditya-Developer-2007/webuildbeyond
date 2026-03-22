import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const endpoint = tab === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const payload = tab === 'signup'
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const { data } = await axios.post(endpoint, payload);
      login(data.token, data.user);
      toast.success(tab === 'signup' ? '🎉 Account created!' : `Welcome back, ${data.user.name.split(' ')[0]}!`);
      navigate(data.user.isAdmin ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      toast.success(data.message);
      setShowForgot(false);
      setForgotEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <h3 style={s.title}>Forgot Password 🔐</h3>
            <p style={s.subtitle}>Enter your email — we'll send a reset link!</p>
            <form onSubmit={handleForgot} style={s.form}>
              <div style={s.group}>
                <label style={s.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  style={s.input}
                />
              </div>
              <button type="submit" disabled={forgotLoading} style={s.btn}>
                {forgotLoading ? '...' : 'Send Reset Link →'}
              </button>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                style={{ ...s.switchBtn, marginTop: 8, display: 'block', width: '100%', textAlign: 'center' }}
              >
                ← Back to Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div style={s.card}>

        {/* Logo */}
        <Link to="/" style={s.logoWrap}>
          <img src="/Logo.png" alt="We Build Beyond" style={{ height: 85, objectFit: 'contain' }} />
        </Link>

        {/* Tabs */}
        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(tab === 'login' ? s.tabActive : {}) }}
            onClick={() => { setTab('login'); setShowPass(false); }}
          >
            Login
          </button>
          <button
            style={{ ...s.tab, ...(tab === 'signup' ? s.tabActive : {}) }}
            onClick={() => { setTab('signup'); setShowPass(false); }}
          >
            Sign Up
          </button>
        </div>

        <h2 style={s.title}>
          {tab === 'login' ? 'Welcome back 👋' : 'Create your account ✨'}
        </h2>
        <p style={s.subtitle}>
          {tab === 'login'
            ? 'Log in to continue to We Build Beyond'
            : 'Join us — it only takes 30 seconds'}
        </p>

        <form onSubmit={handleSubmit} style={s.form}>

          {/* Name — signup only */}
          {tab === 'signup' && (
            <div style={s.group}>
              <label style={s.label}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={set('name')}
                required
                style={s.input}
              />
            </div>
          )}

          {/* Email */}
          <div style={s.group}>
            <label style={s.label}>Email Address</label>
            <input
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={set('email')}
              required
              style={s.input}
            />
          </div>

          {/* Password with eye */}
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder={tab === 'signup' ? 'Min 6 characters' : '••••••••'}
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
                style={s.inputInner}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={s.eyeBtn}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          {tab === 'login' && (
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                style={s.forgotBtn}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" disabled={submitting} style={s.btn}>
            {submitting
              ? '...'
              : tab === 'login' ? 'Login →' : 'Create Account →'}
          </button>

        </form>

        <p style={s.switchText}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            style={s.switchBtn}
            onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setShowPass(false); }}
          >
            {tab === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>

        <Link to="/" style={s.backLink}>← Back to website</Link>

      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#F4F6FA', position: 'relative', overflow: 'hidden',
    fontFamily: "'Nunito Sans', sans-serif",
  },
  blob1: {
    position: 'absolute', width: 400, height: 400,
    borderRadius: '50%', top: -100, right: -100,
    background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent 70%)',
  },
  blob2: {
    position: 'absolute', width: 350, height: 350,
    borderRadius: '50%', bottom: -80, left: -80,
    background: 'radial-gradient(circle, rgba(147,51,234,0.12), transparent 70%)',
  },
  card: {
    background: 'white', borderRadius: 24,
    padding: '44px 40px', width: '100%', maxWidth: 440,
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    position: 'relative', zIndex: 1,
  },
  logoWrap: {
    display: 'block', textAlign: 'center',
    marginBottom: 28, textDecoration: 'none',
  },
  logo: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 900, fontSize: 20, color: '#0D0D2B',
  },
  tabs: {
    display: 'flex', background: '#F4F6FA',
    borderRadius: 50, padding: 4, marginBottom: 28,
  },
  tab: {
    flex: 1, padding: '9px 0', borderRadius: 50, border: 'none',
    background: 'transparent', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14,
    color: '#6B7280', transition: 'all .2s',
  },
  tabActive: {
    background: 'white', color: '#0D0D2B',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontFamily: "'Nunito', sans-serif", fontWeight: 900,
    fontSize: 22, margin: '0 0 6px', color: '#0D0D2B',
  },
  subtitle: { color: '#6B7280', fontSize: 14, margin: '0 0 24px' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  group: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700, fontSize: 13, color: '#0D0D2B',
  },
  input: {
    border: '1.5px solid #E5E7EB', borderRadius: 10,
    padding: '12px 14px', fontSize: 14, outline: 'none',
    fontFamily: "'Nunito Sans', sans-serif",
    background: '#FAFAFA', color: '#0D0D2B',
  },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #E5E7EB', borderRadius: 10,
    background: '#FAFAFA', overflow: 'hidden',
  },
  inputInner: {
    flex: 1, border: 'none', outline: 'none',
    padding: '12px 14px', fontSize: 14,
    fontFamily: "'Nunito Sans', sans-serif",
    background: 'transparent', color: '#0D0D2B',
  },
  eyeBtn: {
    background: 'none', border: 'none',
    padding: '0 14px', cursor: 'pointer', fontSize: 16,
  },
  forgotBtn: {
    background: 'none', border: 'none',
    color: '#6C63FF', fontSize: 13,
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700, cursor: 'pointer',
  },
  btn: {
    background: 'linear-gradient(135deg,#6C63FF,#9333ea)',
    color: 'white', border: 'none', padding: '14px',
    borderRadius: 50, fontFamily: "'Nunito', sans-serif",
    fontWeight: 800, fontSize: 15, cursor: 'pointer', marginTop: 4,
  },
  switchText: {
    textAlign: 'center', color: '#6B7280',
    fontSize: 13, marginTop: 20,
  },
  switchBtn: {
    background: 'none', border: 'none',
    color: '#6C63FF', fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontSize: 13,
  },
  backLink: {
    display: 'block', textAlign: 'center', marginTop: 12,
    color: '#9CA3AF', fontSize: 13, textDecoration: 'none',
    fontFamily: "'Nunito', sans-serif",
  },
  modalOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000, padding: 20,
  },
  modal: {
    background: 'white', borderRadius: 24,
    padding: '40px', width: '100%', maxWidth: 420,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
};