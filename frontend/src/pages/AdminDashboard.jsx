import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('visitors');
  const [visitors, setVisitors] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [vRes, cRes, sRes] = await Promise.all([
        axios.get('/api/visitors'),
        axios.get('/api/contact'),
        axios.get('/api/visitors/stats'),
      ]);
      setVisitors(vRes.data.visitors);
      setContacts(cRes.data.contacts);
      setStats(sRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/contact/${id}/status`, { status });
      setContacts(contacts.map(c => c._id === id ? { ...c, status } : c));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const statusColor = { new: '#F59E0B', read: '#3B82F6', replied: '#22C55E' };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <Link to="/" style={s.sidebarLogo}>
          We Build <span style={{ color: '#6C63FF' }}>Beyond</span>
        </Link>
        <p style={s.sidebarAdmin}>Admin Panel</p>

        {['visitors', 'contacts'].map(t => (
          <button
            key={t}
            style={{ ...s.sidebarBtn, ...(tab === t ? s.sidebarBtnActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t === 'visitors' ? '👥 Visitors' : '📬 Messages'}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <div style={s.adminInfo}>
          <div style={s.adminAvatar}>{user?.name?.[0]}</div>
          <div>
            <div style={s.adminName}>{user?.name}</div>
            <div style={s.adminRole}>Admin</div>
          </div>
        </div>
        <button onClick={() => { logout(); }} style={s.logoutBtn}>Logout</button>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Stats Row */}
        <div style={s.statsRow}>
          {[
            { label: 'Total Signups', value: stats.totalVisitors ?? '—', icon: '👥' },
            { label: 'Today', value: stats.todayVisitors ?? '—', icon: '📅' },
            { label: 'This Week', value: stats.weekVisitors ?? '—', icon: '📊' },
            { label: 'Messages', value: contacts.length, icon: '📬' },
          ].map(st => (
            <div key={st.label} style={s.statCard}>
              <div style={s.statIcon}>{st.icon}</div>
              <div style={s.statNum}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        <h2 style={s.sectionTitle}>
          {tab === 'visitors' ? '👥 Visitor Signups' : '📬 Contact Messages'}
        </h2>

        {loading ? (
          <div style={s.loading}>Loading...</div>
        ) : tab === 'visitors' ? (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Signed Up', 'Last Login', 'Logins', 'IP'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visitors.length === 0 ? (
                  <tr><td colSpan={6} style={s.empty}>No visitors yet</td></tr>
                ) : visitors.map(v => (
                  <tr key={v._id} style={s.tr}>
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={s.avatar}>{v.name?.[0]}</div>
                        {v.name}
                      </div>
                    </td>
                    <td style={s.td}>{v.email}</td>
                    <td style={s.td}>{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td style={s.td}>{v.lastLogin ? new Date(v.lastLogin).toLocaleDateString() : '—'}</td>
                    <td style={s.td}>{v.loginCount}</td>
                    <td style={s.td}>{v.ipAddress || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Message', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr><td colSpan={6} style={s.empty}>No messages yet</td></tr>
                ) : contacts.map(c => (
                  <tr key={c._id} style={s.tr}>
                    <td style={s.td}>{c.name}</td>
                    <td style={s.td}>{c.email}</td>
                    <td style={{ ...s.td, maxWidth: 260 }}>
                      <span title={c.message} style={s.msgPreview}>{c.message}</span>
                    </td>
                    <td style={s.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: statusColor[c.status] + '22', color: statusColor[c.status] }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={s.td}>
                      <select
                        value={c.status}
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                        style={s.select}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  page: {
    display: 'flex', minHeight: '100vh',
    fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#F4F6FA',
  },
  sidebar: {
    width: 220, background: '#0D0D2B', padding: '28px 20px',
    display: 'flex', flexDirection: 'column', gap: 6, position: 'sticky', top: 0, height: '100vh',
  },
  sidebarLogo: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: 17,
    color: 'white', textDecoration: 'none', marginBottom: 4,
  },
  sidebarAdmin: { color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 20 },
  sidebarBtn: {
    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
    padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14,
    textAlign: 'left', transition: 'all .2s',
  },
  sidebarBtnActive: { background: 'rgba(108,99,255,0.25)', color: 'white' },
  adminInfo: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,.1)' },
  adminAvatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg,#6C63FF,#9333ea)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: 15,
  },
  adminName: { color: 'white', fontWeight: 700, fontSize: 13 },
  adminRole: { color: 'rgba(255,255,255,.4)', fontSize: 11 },
  logoutBtn: {
    background: 'rgba(255,255,255,.07)', border: 'none',
    color: 'rgba(255,255,255,.5)', padding: '9px 14px',
    borderRadius: 10, cursor: 'pointer', textAlign: 'left',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13,
  },
  main: { flex: 1, padding: '40px 36px', overflowX: 'auto' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 36 },
  statCard: {
    background: 'white', borderRadius: 16, padding: '22px',
    border: '1px solid #EBEBEB', textAlign: 'center',
  },
  statIcon: { fontSize: 26, marginBottom: 8 },
  statNum: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: 30, color: '#0D0D2B' },
  statLabel: { color: '#6B7280', fontSize: 13, fontWeight: 600, marginTop: 4 },
  sectionTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: 20,
    color: '#0D0D2B', marginBottom: 20,
  },
  tableWrap: { background: 'white', borderRadius: 16, border: '1px solid #EBEBEB', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 12,
    color: '#6B7280', textAlign: 'left', letterSpacing: '0.5px',
  },
  tr: { borderBottom: '1px solid #F3F4F6', transition: 'background .15s' },
  td: { padding: '14px 16px', fontSize: 14, color: '#374151', verticalAlign: 'middle' },
  nameCell: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'linear-gradient(135deg,#6C63FF,#9333ea)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: 13, flexShrink: 0,
  },
  msgPreview: { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  badge: {
    display: 'inline-block', padding: '3px 12px', borderRadius: 50,
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 12,
  },
  select: {
    border: '1.5px solid #E5E7EB', borderRadius: 8,
    padding: '5px 10px', fontSize: 13, cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
    outline: 'none',
  },
  empty: { textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 14 },
  loading: { textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 14 },
};
