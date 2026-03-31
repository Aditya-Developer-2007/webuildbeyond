import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useEffect, useRef } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('scroll-visible');
         }
       });
      },
      { threshold: 0.15 }
    );
    
    // Allow DOM to flush
    const timeoutId = setTimeout(() => {
      document.querySelectorAll('.scroll-hidden').forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const setField = (k) => (e) => setContactForm({ ...contactForm, [k]: e.target.value });

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await axios.post('/api/contact', contactForm);
      toast.success(data.message);
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff', color: '#0D0D2B' }}>
      <Navbar />

      <section id="home" className="grid-bg" style={s.hero}>
        <span className="stagger-1" style={s.badge}><span style={s.dot} /> Web Development Agency</span>
        <h1 className="stagger-2" style={s.heroTitle}>
          Your Business Deserves<br />
          to Be Seen <span style={{ color: '#6C63FF' }}>Online</span>
        </h1>
        <p className="stagger-3" style={s.heroSub}>
          We help you build a professional and effective online presence.
        </p>
        <div className="hero-btns-wrap stagger-4" style={s.heroButtons}>
          <button onClick={() => scrollTo('contact')} style={s.btnDark}>Start a Project &nbsp;→</button>
          <button onClick={() => scrollTo('work')} style={s.btnOutline}>▶ &nbsp;View Our Work</button>
        </div>
      </section>

      <section id="services" style={s.section}>
        <div style={s.sectionHeader}>
          <span style={{ ...s.badge2, background:'#ede9ff', color:'#6C63FF' }}>What We Do</span>
          <h2 style={s.sectionTitle}>Services Built for <span style={{ color:'#6C63FF' }}>Impact</span></h2>
          <p style={s.sectionSub}>Everything you need to establish and grow your digital presence — crafted with care.</p>
        </div>
        <div className="grid-3-col" style={s.grid3}>
          {[
            { tag:'UI/UX', icon:'🖥️', bg:'linear-gradient(135deg,#3B7EF8,#5B9FFF)', title:'Website Design', desc:'Pixel-perfect, visually stunning designs that captivate your audience and reflect your brand identity with purpose.' },
            { tag:'Dev', icon:'</>',  bg:'linear-gradient(135deg,#7C3AED,#a855f7)', title:'Website Development', desc:'Fast, secure, and scalable websites built with modern tech stacks — optimized for performance and conversion.' },
            { tag:'Redesign', icon:'🔄', bg:'linear-gradient(135deg,#EC4899,#f472b6)', title:'Website Redesign', desc:'Transform your outdated site into a modern powerhouse — improved UX, fresh aesthetics, and better results.' },
          ].map(c => (
            <div key={c.title} className="glass-card scroll-hidden" style={s.card}>
              <div style={s.cardTag}>{c.tag}</div>
              <div style={{ ...s.cardIcon, background: c.bg }}>{c.icon}</div>
              <h3 style={s.cardTitle}>{c.title}</h3>
              <p style={s.cardDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <hr style={s.hr} />

      <section id="social" style={{ ...s.section, background:'#F4F6FA' }}>
        <div style={s.sectionHeader}>
          <span style={{ ...s.badge2, background:'#fde8f5', color:'#d63aad' }}>Social Media & PR</span>
          <h2 style={s.sectionTitle}>Instagram & PR Content That <span style={{ color:'#EC4899' }}>Captures Attention</span></h2>
          <p style={s.sectionSub}>Build your brand with compelling social media content and PR strategies that resonate, engage, and convert.</p>
        </div>
        <div className="grid-3-col" style={s.grid3}>
          {[
            { icon:'❤️', bg:'linear-gradient(135deg,#F43F5E,#fb7185)', title:'Viral Content Creation', desc:'Crafted posts and reels designed to maximize engagement, reach, and meaningful interactions.' },
            { icon:'👥', bg:'linear-gradient(135deg,#3B7EF8,#5B9FFF)', title:'Community Management', desc:'Strategic audience building and engagement tactics that turn followers into loyal brand advocates.' },
            { icon:'📈', bg:'linear-gradient(135deg,#7C3AED,#a855f7)', title:'Growth Strategy', desc:'Data-driven campaigns that accelerate follower growth and amplify your brand presence.' },
            { icon:'⚡', bg:'linear-gradient(135deg,#F97316,#fb923c)', title:'Campaign Execution', desc:'End-to-end PR campaigns that generate buzz, build credibility, and drive real business results.' },
            { icon:'💬', bg:'linear-gradient(135deg,#22C55E,#4ade80)', title:'Content Strategy', desc:'Custom content calendars and storytelling that aligns with your brand voice and business goals.' },
            { icon:'🔗', bg:'linear-gradient(135deg,#475569,#64748b)', title:'Cross-Platform Promotion', desc:'Seamless distribution across Instagram, TikTok, Twitter, and LinkedIn to maximize your reach.' },
          ].map(c => (
            <div key={c.title} className="glass-card scroll-hidden" style={s.card}>
              <div style={{ ...s.cardIcon, background: c.bg }}>{c.icon}</div>
              <h3 style={s.cardTitle}>{c.title}</h3>
              <p style={s.cardDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={s.ctaBanner}>
          <h3 style={{ fontSize:28, fontWeight:900, marginBottom:10 }}>Ready to Go Viral?</h3>
          <p style={{ opacity:.9, maxWidth:500, margin:'0 auto 24px', lineHeight:1.6 }}>
            Let's create content that stops the scroll and builds your brand's authority across social platforms.
          </p>
          <button onClick={() => scrollTo('contact')} style={s.btnWhite}>Start a Campaign &nbsp;→</button>
        </div>
      </section>
      <hr style={s.hr} />

      <section id="work" style={s.section}>
        <div style={s.sectionHeader}>
          <span style={{ ...s.badge2, background:'#ede9ff', color:'#6C63FF' }}>Our Work</span>
          <h2 style={s.sectionTitle}>Projects That <span style={{ color:'#6C63FF' }}>Speak</span></h2>
          <p style={s.sectionSub}>A curated selection of our finest work — built to convert and designed to impress.</p>
        </div>
        <div className="grid-3-col" style={s.grid3}>
          {[
            { abbr:'LU', bg:'linear-gradient(135deg,#3B7EF8,#5B4AE8)', tag:'E-commerce', tagColor:'#2563eb', tagBg:'#e0eeff', title:'Luxe Commerce', desc:'Premium fashion brand with blazing-fast storefront and seamless checkout.' },
            { abbr:'FF', bg:'linear-gradient(135deg,#4C1D95,#7C3AED)', tag:'SaaS App', tagColor:'#6C63FF', tagBg:'#ede9ff', title:'FinFlow Dashboard', desc:'Intuitive financial dashboard with real-time analytics and clean data visualization.' },
            { abbr:'NO', bg:'linear-gradient(135deg,#14B8A6,#2DD4BF)', tag:'Healthcare', tagColor:'#0d9488', tagBg:'#d1faf4', title:'NovaMed Clinic', desc:'Modern medical practice website with online booking and patient portal.' },
          ].map(p => (
            <div className="glass-card scroll-hidden" key={p.title} style={s.projectCard}>
              <div style={{ ...s.projectThumb, background: p.bg }}>
                {p.abbr}
                <div style={s.projectOverlay}><span style={s.viewLive}>View Live</span></div>
              </div>
              <div style={{ padding:'20px 22px' }}>
                <span style={{ ...s.badge2, background: p.tagBg, color: p.tagColor, fontSize:11, padding:'3px 12px' }}>{p.tag}</span>
                <h3 style={{ ...s.cardTitle, marginTop:8 }}>{p.title}</h3>
                <p style={s.cardDesc}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <hr style={s.hr} />

      <section id="why" style={{ ...s.section, background:'#F4F6FA' }}>
        <div className="why-grid-wrap" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'start' }}>
          <div>
            <span style={{ ...s.badge2, background:'#ede9ff', color:'#6C63FF' }}>Why Us</span>
            <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:'clamp(26px,3.5vw,40px)', lineHeight:1.1, letterSpacing:-1, margin:'10px 0 16px' }}>
              Built Different,<br /><span style={{ color:'#6C63FF' }}>Delivered Better</span>
            </h2>
            <p style={{ color:'#6B7280', fontSize:15, lineHeight:1.65, marginBottom:28 }}>
              We don't just build websites — we craft digital experiences that drive growth, build trust, and convert visitors into loyal customers.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[['50+','Projects Done'],['98%','Client Satisfaction'],['3x','Avg. Traffic Boost']].map(([n,l]) => (
                <div key={l} style={{ background:'white', border:'1px solid #EBEBEB', borderRadius:14, padding:'14px 20px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:24, color:'#6C63FF' }}>{n}</div>
                  <div style={{ fontSize:12, color:'#6B7280', fontWeight:600, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="why-right-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { icon:'⚡', title:'Lightning Fast Delivery', desc:"We move fast without cutting corners. Your project is delivered on time, every time." },
              { icon:'✅', title:'Premium Quality Code', desc:"Clean, maintainable, and scalable code that performs flawlessly on every device." },
              { icon:'💬', title:'Dedicated Support', desc:"We're with you beyond launch — proactive support and ongoing improvements." },
              { icon:'📊', title:'Results-Driven Design', desc:"Every design decision is backed by conversion principles — your website works hard." },
            ].map(w => (
              <div className="glass-card scroll-hidden" key={w.title} style={s.whyCard}>
                <div style={{ fontSize:22, marginBottom:12 }}>{w.icon}</div>
                <h4 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:15, marginBottom:8 }}>{w.title}</h4>
                <p style={{ color:'#6B7280', fontSize:13, lineHeight:1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <hr style={s.hr} />

      <section style={s.section}>
        <div style={s.ctaMain}>
          <span style={s.ctaBadge}>Let's Work Together</span>
          <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:'clamp(24px,4vw,42px)', margin:'0 0 14px' }}>
            Let's Build Your Online Presence
          </h2>
          <p style={{ opacity:.85, fontSize:15, maxWidth:480, margin:'0 auto 32px', lineHeight:1.65 }}>
            Ready to take your business to the next level? Let's create something extraordinary together.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => scrollTo('contact')} style={s.btnWhiteFill}>Get Free Demo &nbsp;→</button>
            <button onClick={() => scrollTo('work')} style={s.btnOutlineWhite}>See Our Work</button>
          </div>
        </div>
      </section>

      <section id="contact" style={{ ...s.section, background:'#F4F6FA' }}>
        <div style={s.sectionHeader}>
          <span style={{ ...s.badge2, background:'#ede9ff', color:'#6C63FF' }}>Contact Us</span>
          <h2 style={s.sectionTitle}>Start a <span style={{ color:'#6C63FF' }}>Conversation</span></h2>
          <p style={s.sectionSub}>Ready to build something great? Drop us a message and we'll get back to you within 24 hours.</p>
        </div>
        <div className="contact-grid-wrap" style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:32 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { icon:'✉️', bg:'#EFF6FF', label:'Email Us', value:'weebuildbeyond@gmail.com' },
              { icon:'🕐', bg:'#F3F0FF', label:'Response Time', value:'Within 24 hours' },
              { icon:'📞', bg:'#F0FDF4', label:'Call / WhatsApp', value:'+91 85276 06769' },
            ].map(c => (
              <div key={c.label} style={s.contactCard}>
                <div style={{ ...s.contactIcon, background: c.bg }}>{c.icon}</div>
                <div>
                  <small style={{ color:'#9CA3AF', fontSize:12, fontWeight:600, display:'block' }}>{c.label}</small>
                  <strong style={{ fontSize:14, fontWeight:800 }}>{c.value}</strong>
                </div>
              </div>
            ))}
            <a href="https://wa.me/918527606769" target="_blank" rel="noreferrer" style={s.whatsappBtn}>
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          <form onSubmit={handleContact} style={s.contactForm}>
            <div className="form-row-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Full Name</label>
                <input type="text" placeholder="Your Name.." value={contactForm.name} onChange={setField('name')} required style={s.formInput} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Email Address</label>
                <input type="email" placeholder="Your Email.." value={contactForm.email} onChange={setField('email')} required style={s.formInput} />
              </div>
            </div>
            <div style={{ ...s.formGroup, marginBottom:20 }}>
              <label style={s.formLabel}>Your Message</label>
              <textarea placeholder="Message..." value={contactForm.message} onChange={setField('message')} required style={{ ...s.formInput, minHeight:110, resize:'vertical' }} />
            </div>
            <button type="submit" disabled={sending} style={s.btnSend}>
              {sending ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </section>

      <footer style={s.footer}>
        <div className="footer-grid-wrap" style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr', gap:48, paddingBottom:40, borderBottom:'1px solid rgba(255,255,255,.1)' }}>
          <div>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:18, color:'white', marginBottom:12 }}>
              <img src="/Logo.png" alt="We Build Beyond" style={{ height: 70, objectFit: 'contain', filter: 'invert(1)' }} />
            </div>
            <p style={{ color:'rgba(255,255,255,.5)', fontSize:14, lineHeight:1.6, marginBottom:18 }}>
              We craft modern, high-converting websites that help businesses grow, stand out, and thrive online.
            </p>
            <div style={{ display:'flex', gap:10 }}>
            <a href="#" target="_blank" rel="noreferrer" style={s.socialIcon}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            <a href="#" target="_blank" rel="noreferrer" style={s.socialIcon}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>

            <a href="https://www.instagram.com/we.build.beyond/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer" style={s.socialIcon}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            </div>
          </div>
          {[['Navigate',['Home','Services','Work','Contact']],['Services',['Website Design','Web Development','Website Redesign','SEO Optimization']]].map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ color:'white', fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:14, marginBottom:18 }}>{heading}</h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                {links.map(l => (
                  <li key={l}><a href="#" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none', fontSize:14, fontFamily:"'Nunito Sans',sans-serif" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:24, flexWrap:'wrap', gap:12 }}>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:13 }}>© 2026 We Build Beyond. All rights reserved.</p>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy Policy','Terms of Service'].map(l => (
              <a key={l} href="#" style={{ color:'rgba(255,255,255,.35)', fontSize:13, textDecoration:'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})} style={s.scrollTop}>↑</button>
    </div>
  );
}

const s = {
  hero: { textAlign:'center', padding:'130px 0px' },
  heroTitle: { fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:'clamp(50px,5.5vw,80px)', lineHeight:1.1, letterSpacing:-1.5, margin:'18px auto 18px', maxWidth:1000 },
  heroSub: { color:'#6B7280', fontSize:17, maxWidth:480, margin:'0 auto 36px', lineHeight:1.65 },
  heroButtons: { display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', paddingBottom:60 },
  badge: { display:'inline-flex', alignItems:'center', gap:7, background:'white', border:'1px solid #E5E7EB', borderRadius:50, padding:'6px 16px', fontSize:13, fontWeight:700, color:'#0D0D2B', fontFamily:"'Nunito',sans-serif" },
  dot: { width:8, height:8, borderRadius:'50%', background:'#6C63FF', display:'inline-block' },
  badge2: { display:'inline-block', borderRadius:50, padding:'5px 16px', fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif" },
  statsBar: { background:'#F4F6FA', display:'grid', gridTemplateColumns:'repeat(4,1fr)', padding:'40px 60px 40px', borderTop:'1px solid #E5E7EB' },
  statNum: { fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:38, color:'#0D0D2B' },
  statLabel: { color:'#6B7280', fontSize:14, marginTop:4, fontWeight:600 },
  scrollHint: { textAlign:'center', padding:'10px 0 20px', background:'#F4F6FA', fontSize:11, fontWeight:700, letterSpacing:3, color:'#9CA3AF' },
  hr: { border:'none', borderTop:'1px solid #E5E7EB', margin:0 },
  section: { padding:'90px 60px', background:'white' },
  sectionHeader: { textAlign:'center', marginBottom:52 },
  sectionTitle: { fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:'clamp(30px,4vw,44px)', lineHeight:1.1, letterSpacing:-1, marginTop:12 },
  sectionSub: { color:'#6B7280', fontSize:16, maxWidth:520, margin:'14px auto 0', lineHeight:1.65 },
  grid3: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 },
  card: { background:'white', border:'1px solid #EBEBEB', borderRadius:18, padding:28 },
  cardTag: { fontSize:12, fontWeight:700, color:'#9CA3AF', textAlign:'right', marginBottom:16, fontFamily:"'Nunito',sans-serif" },
  cardIcon: { width:52, height:52, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:18 },
  cardTitle: { fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:17, marginBottom:10 },
  cardDesc: { color:'#6B7280', fontSize:14, lineHeight:1.6 },
  ctaBanner: { background:'linear-gradient(135deg,#EC4899,#F97316)', borderRadius:20, textAlign:'center', padding:'60px 40px', marginTop:48, color:'white' },
  btnWhite: { background:'white', color:'#6C63FF', border:'none', padding:'14px 28px', borderRadius:50, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:15, cursor:'pointer' },
  projectCard: { background:'white', border:'1px solid #EBEBEB', borderRadius:18, overflow:'hidden' },
  projectThumb: { height:200, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, fontWeight:900, letterSpacing:4, color:'rgba(255,255,255,.35)', position:'relative', fontFamily:"'Nunito',sans-serif" },
  projectOverlay: { position:'absolute', inset:0, background:'rgba(0,0,0,.25)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity .25s' },
  viewLive: { background:'white', color:'#0D0D2B', borderRadius:50, padding:'10px 22px', fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:14, cursor:'pointer' },
  whyCard: { background:'white', border:'1px solid #EBEBEB', borderRadius:16, padding:22 },
  ctaMain: { background:'linear-gradient(135deg,#5B4AE8,#7C3AED,#9333ea)', borderRadius:24, textAlign:'center', padding:'70px 40px', color:'white', position:'relative', overflow:'hidden' },
  ctaBadge: { display:'inline-block', background:'rgba(255,255,255,.2)', color:'white', borderRadius:50, padding:'5px 16px', fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif", marginBottom:20, border:'1px solid rgba(255,255,255,.3)' },
  btnWhiteFill: { background:'white', color:'#6C63FF', border:'none', padding:'14px 28px', borderRadius:50, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', gap:8 },
  btnOutlineWhite: { background:'transparent', color:'white', border:'2px solid rgba(255,255,255,.6)', padding:'14px 28px', borderRadius:50, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, cursor:'pointer' },
  contactCard: { background:'white', border:'1px solid #EBEBEB', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:14 },
  contactIcon: { width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 },
  whatsappBtn: { background:'#22C55E', color:'white', border:'none', padding:15, borderRadius:50, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, textDecoration:'none', marginTop:4 },
  contactForm: { background:'white', border:'1px solid #EBEBEB', borderRadius:18, padding:32 },
  formGroup: { display:'flex', flexDirection:'column', gap:5 },
  formLabel: { fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:14, color:'#0D0D2B' },
  formInput: { border:'1.5px solid #E5E7EB', borderRadius:10, padding:'12px 14px', fontSize:14, outline:'none', fontFamily:"'Nunito Sans',sans-serif", background:'#FAFAFA', color:'#0D0D2B' },
  btnSend: { background:'#6C63FF', color:'white', border:'none', padding:'14px 28px', borderRadius:50, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:15, cursor:'pointer' },
  btnDark: { background:'#0D0D2B', color:'white', border:'none', padding:'14px 28px', borderRadius:50, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', gap:8 },
  btnOutline: { background:'white', color:'#0D0D2B', border:'1.5px solid #E5E7EB', padding:'14px 28px', borderRadius:50, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', gap:8 },
  footer: { background:'#0D0D2B', color:'white', padding:'60px 60px 32px', fontFamily:"'Nunito Sans',sans-serif" },
  socialIcon: { width:36, height:36, borderRadius:8, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, cursor:'pointer', color:'white', textDecoration:'none' },
  scrollTop: { position:'fixed', bottom:28, right:28, zIndex:200, width:44, height:44, borderRadius:'50%', background:'#6C63FF', color:'white', border:'none', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(108,99,255,.4)' },
};
