import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setMenuOpen(false);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <nav style={styles.nav}>

        {/* Logo */}
        <Link to="/">
          <img
            src="/Logo.png"
            alt="We Build Beyond"
            style={{ height: 60, objectFit: 'contain' }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul style={styles.navLinks}>
          {['home', 'services', 'work', 'contact'].map(id => (
            <li key={id}>
              <button onClick={() => scrollTo(id)} style={styles.navBtn}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="desktop-auth" style={styles.right}>
          {user ? (
            <>
              <span style={styles.greeting}>Hi, {user.name.split(' ')[0]} 👋</span>
              {user.isAdmin && (
                <Link to="/admin" style={styles.adminLink}>Dashboard</Link>
              )}
              <button onClick={handleLogout} style={styles.btnOutlineSmall}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/auth')} style={styles.btnOutlineSmall}>
                Login
              </button>
              <button onClick={() => navigate('/auth?tab=signup')} style={styles.btnPrimary}>
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Hamburger — Mobile Only */}
<button
  className="hamburger-btn"
  onClick={() => setMenuOpen(!menuOpen)}
  aria-label="Menu"
>
  <div style={{
    ...styles.hamburgerIcon,
    ...(menuOpen ? styles.line1Open : {}),
  }} />
  <div style={{
    ...styles.hamburgerIcon,
    opacity: menuOpen ? 0 : 1,
    transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
  }} />
  <div style={{
    ...styles.hamburgerIcon,
    ...(menuOpen ? styles.line3Open : {}),
  }} />
</button>

      </nav>


      {/* Overlay */}
      {menuOpen && (
        <div style={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div style={{
        ...styles.sidebar,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>

        {/* Sidebar Header */}
        <div style={styles.sidebarHeader}>
          <img
            src="/Logo.png"
            alt="We Build Beyond"
            style={{ height: 36, objectFit: 'contain' }}
          />
          <button style={styles.closeBtn} onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div style={styles.sidebarLinks}>
          {['home', 'services', 'work', 'contact'].map(id => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={styles.sidebarBtn}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        {/* Sidebar Auth */}
        <div style={styles.sidebarAuth}>
          {user ? (
            <>
              <p style={styles.sidebarGreeting}>Hi, {user.name.split(' ')[0]} 👋</p>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  style={styles.sidebarAdminLink}
                  onClick={() => setMenuOpen(false)}
                >
                  📊 Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} style={styles.sidebarLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                style={styles.sidebarLoginBtn}
              >
                Login
              </button>
              <button
                onClick={() => { navigate('/auth?tab=signup'); setMenuOpen(false); }}
                style={styles.sidebarSignupBtn}
              >
                Get Started →
              </button>
            </>
          )}
        </div>

      </div>
    </>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 200,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 60px', height: 68,
  },
  navLinks: {
    display: 'flex', gap: 36, listStyle: 'none', margin: 0, padding: 0,
  },
  navBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 15,
    color: '#374151', padding: 0,
  },
  right: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  greeting: {
    fontFamily: "'Nunito', sans-serif", fontWeight: 700,
    fontSize: 14, color: '#374151',
  },
  adminLink: {
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14,
    color: '#6C63FF', textDecoration: 'none', marginRight: 4,
  },
  btnOutlineSmall: {
    background: 'white', color: '#0D0D2B',
    border: '1.5px solid #E5E7EB',
    padding: '8px 18px', borderRadius: 50,
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13,
    cursor: 'pointer',
  },
  btnPrimary: {
    background: '#6C63FF', color: 'white', border: 'none',
    padding: '10px 22px', borderRadius: 50,
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13,
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 300,
    backdropFilter: 'blur(2px)',
  },
  sidebar: {
    position: 'fixed', top: 0, right: 0,
    width: 280, height: '100vh',
    background: 'white',
    boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
    zIndex: 400,
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
    padding: '0 0 40px',
  },
  sidebarHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #F3F4F6',
  },
  closeBtn: {
    background: '#F4F6FA', border: 'none',
    width: 36, height: 36, borderRadius: '50%',
    fontSize: 16, cursor: 'pointer', color: '#374151',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  sidebarLinks: {
    display: 'flex', flexDirection: 'column',
    padding: '20px 16px', gap: 4,
  },
  sidebarBtn: {
    background: 'none', border: 'none',
    textAlign: 'left', padding: '14px 16px',
    borderRadius: 12, cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 16,
    color: '#374151',
  },
  sidebarAuth: {
    marginTop: 'auto', padding: '20px 24px',
    borderTop: '1px solid #F3F4F6',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  sidebarGreeting: {
    fontFamily: "'Nunito', sans-serif", fontWeight: 700,
    fontSize: 15, color: '#374151', marginBottom: 4,
  },
  sidebarAdminLink: {
    display: 'block', padding: '12px 16px',
    background: '#ede9ff', color: '#6C63FF',
    borderRadius: 12, textDecoration: 'none',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14,
    textAlign: 'center',
  },
  sidebarLogout: {
    background: '#F4F6FA', border: 'none',
    padding: '12px', borderRadius: 12, cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14,
    color: '#374151',
  },
  sidebarLoginBtn: {
    background: 'white', color: '#0D0D2B',
    border: '1.5px solid #E5E7EB',
    padding: '13px', borderRadius: 50,
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15,
    cursor: 'pointer',
  },
  sidebarSignupBtn: {
    background: 'linear-gradient(135deg,#6C63FF,#9333ea)',
    color: 'white', border: 'none',
    padding: '13px', borderRadius: 50,
    fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15,
    cursor: 'pointer',
  },
  hamburgerIcon: {
  width: 22,
  height: 2.5,
  background: '#0D0D2B',
  borderRadius: 4,
  transition: 'all 0.3s ease',
  transformOrigin: 'center',
},
line1Open: {
  transform: 'rotate(45deg) translate(5px, 5px)',
},
line3Open: {
  transform: 'rotate(-45deg) translate(5px, -5px)',
},
};