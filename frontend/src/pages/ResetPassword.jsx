import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link!');
      navigate('/auth');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/auth/reset-password', { token, password });
      toast.success(data.message);
      navigate('/auth');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.card}>

        {/* Logo */}
        <Link to="/" style={s.logoWrap}>
            <img src="/src/assets/Logo.png" alt="We Build Beyond" style={{ height: 85, objectFit: 'contain' }} />
        </Link>

        <h2 style={s.title}>Reset Password 🔐</h2>
        <p style={s.subtitle}>Enter your new password below</p>

        <form onSubmit={handleSubmit} style={s.form}>

          {/* New Password */}
          <div style={s.group}>
            <label style={s.label}>New Password</label>
            <div style={s.inputWrap}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm Password */}
          <div style={s.group}>
            <label style={s.label}>Confirm Password</label>
            <div style={s.inputWrap}>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                style={s.inputInner}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={s.eyeBtn}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Password match indicator */}
          {confirm.length > 0 && (
            <p style={{
              fontSize: 13, fontWeight: 700, margin: '-8px 0 0',
              color: password === confirm ? '#22C55E' : '#EF4444',
            }}>
              {password === confirm ? '✅ Passwords match!' : '❌ Passwords do not match'}
            </p>
          )}

          <button type="submit" disabled={submitting} style={s.btn}>
            {submitting ? '...' : 'Reset Password →'}
          </button>

        </form>

        <Link to="/auth" style={s.backLink}>← Back to Login</Link>

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
  title: {
    fontFamily: "'Nunito', sans-serif", fontWeight: 900,
    fontSize: 22, margin: '0 0 6px', color: '#0D0D2B',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280', fontSize: 14,
    margin: '0 0 24px', textAlign: 'center',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  group: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700, fontSize: 13, color: '#0D0D2B',
  },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #E5E7EB', borderRadius: 10,
    background: '#FAFAFA', overflow: 'hidden',
    transition: 'border-color .2s',
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
  btn: {
    background: 'linear-gradient(135deg,#6C63FF,#9333ea)',
    color: 'white', border: 'none', padding: '14px',
    borderRadius: 50, fontFamily: "'Nunito', sans-serif",
    fontWeight: 800, fontSize: 15, cursor: 'pointer', marginTop: 4,
  },
  backLink: {
    display: 'block', textAlign: 'center', marginTop: 16,
    color: '#9CA3AF', fontSize: 13, textDecoration: 'none',
    fontFamily: "'Nunito', sans-serif",
  },
};