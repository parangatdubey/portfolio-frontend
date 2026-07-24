import React, { useState, useEffect } from 'react';

// Centralized Base URL (Port change karne ke liye bas yahan badlein)
const BASE_URL = "http://localhost:5000";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  // Contact State Hooks
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Message delivered successfully to Parangat's Database! 🚀");
        setContactName(''); setContactEmail(''); setContactSubject(''); setContactMessage('');
      } else {
        alert("Sync error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Backend server connection missing.");
    }
  };
  
  // Dynamic Profile Image State via LocalStorage
  const [profileImg, setProfileImg] = useState(() => {
    return localStorage.getItem('parangat_avatar') || '';
  });
  const [avatarInput, setAvatarInput] = useState('');

  // Project Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [projectLink, setProjectLink] = useState('');

  const [activeTab, setActiveTab] = useState('home');
  const API_URL = `${BASE_URL}/api/projects`;

  const fetchProjects = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    const handleScroll = () => {
      const sections = ['home', 'about', 'qualification', 'skills', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top && scrollPosition < top + element.offsetHeight) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateAvatar = (e) => {
    e.preventDefault();
    if (avatarInput.trim()) {
      localStorage.setItem('parangat_avatar', avatarInput.trim());
      setProfileImg(avatarInput.trim());
      setAvatarInput('');
      alert("Profile picture synchronized! 🔥");
    }
  };

  const handleResetAvatar = () => {
    localStorage.removeItem('parangat_avatar');
    setProfileImg('');
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category: 'Project',
          description,
          tags: tags ? tags.split(',').map(t => t.trim()) : [],
          resourceLink: projectLink
        })
      });
      if (res.ok) {
        fetchProjects();
        setTitle(''); setDescription(''); setTags(''); setProjectLink('');
        setShowAdmin(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Purge this project?")) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProjects();
    }
  };

  return (
    <div style={{ backgroundColor: '#0d0d0f', color: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      
      {/* STICKY GLASS NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', background: 'rgba(13, 13, 15, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
        <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#9333ea', letterSpacing: '0.5px' }}>
          Parangat Dubey
        </div>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          {['home', 'about', 'qualification', 'skills', 'portfolio', 'contact'].map(tab => (
            <a key={tab} href={`#${tab}`} style={{ color: activeTab === tab ? '#9333ea' : '#94a3b8', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize', transition: 'color 0.2s' }}>{tab}</a>
          ))}
          <button onClick={() => setShowAdmin(!showAdmin)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #9333ea', backgroundColor: 'transparent', color: '#9333ea', cursor: 'pointer', fontSize: '0.85rem' }}>
            {showAdmin ? 'Hide Hub ×' : 'Admin Hub ⚙️'}
          </button>
        </div>
      </nav>

      {/* DYNAMIC HUB ACCORDION */}
      {showAdmin && (
        <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 20px' }}>
          <div style={{ background: '#141417', padding: '25px', borderRadius: '14px', border: '1px solid rgba(147, 51, 234, 0.2)' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '1rem' }}>🖼️ Social Profile Sync (Paste Image URL)</h3>
              <form onSubmit={handleUpdateAvatar} style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Paste image address/URL..." value={avatarInput} onChange={(e) => setAvatarInput(e.target.value)} required style={{ flex: 1, padding: '10px', borderRadius: '6px', backgroundColor: '#0d0d0f', border: '1px solid #27272a', color: '#fff' }} />
                <button type="submit" style={{ padding: '10px 15px', borderRadius: '6px', backgroundColor: '#9333ea', color: '#fff', border: 'none', cursor: 'pointer' }}>Update</button>
                {profileImg && <button type="button" onClick={handleResetAvatar} style={{ padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Reset</button>}
              </form>
            </div>
            <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ color: '#fff', margin: '0', fontSize: '1rem' }}>➕ Live Portfolio Project Deployer</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1, padding: '10px', borderRadius: '6px', backgroundColor: '#0d0d0f', border: '1px solid #27272a', color: '#fff' }} />
                <input type="text" placeholder="Tech Stacks" value={tags} onChange={(e) => setTags(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', backgroundColor: '#0d0d0f', border: '1px solid #27272a', color: '#fff' }} />
              </div>
              <input type="text" placeholder="Deployment / Github Link" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#0d0d0f', border: '1px solid #27272a', color: '#fff' }} />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#0d0d0f', border: '1px solid #27272a', color: '#fff', minHeight: '60px' }}></textarea>
              <button type="submit" style={{ padding: '10px', backgroundColor: '#9333ea', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Push Node Live</button>
            </form>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px' }}>

        {/* ==================== SECTION 1: HOME ==================== */}
        <section id="home" style={{ minHeight: '85vh', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center', paddingTop: '40px' }}>
          <div>
            <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: '500' }}>Hello</span>
            <h1 style={{ fontSize: '3.8rem', fontWeight: '800', margin: '10px 0', color: '#fff', lineHeight: '1.1' }}>
              I'm <span style={{ color: '#fff' }}>Parangat Dubey</span> <br/>
              a <span style={{ background: 'linear-gradient(to right, #9333ea, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Full Stack Developer</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', margin: '20px 0 35px 0', maxWidth: '550px' }}>
              Hi, I'm Parangat Dubey, a Full Stack Developer! I specialize in making websites look fantastic and easy to use. I combine colors, shapes, and backend storage to provide a great secure user experience. Let's turn your web vision into reality! 🌐✨
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#contact" style={{ padding: '12px 28px', backgroundColor: '#9333ea', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: '700', boxShadow: '0 4px 14px rgba(147, 51, 234, 0.4)' }}>Hire Me</a>
              <a href="#portfolio" style={{ padding: '12px 28px', backgroundColor: 'transparent', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', border: '1px solid #27272a' }}>Portfolio</a>
            </div>
          </div>
          
          {/* Exact Screenshot Blob Image Layout Wrapper */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '320px', height: '320px', background: '#c084fc', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {profileImg ? (
                <img src={profileImg} alt="Parangat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '4.5rem', fontWeight: '900', color: '#030014' }}>PD</span>
              )}
            </div>
          </div>
        </section>


        {/* ==================== SECTION 2: ABOUT ==================== */}
        <section id="about" style={{ padding: '100px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: '#9333ea', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Who Am I?</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '5px 0 0 0', color: '#fff' }}>I'm Parangat Dubey, a Full Stack Web Architect</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '60px', alignItems: 'center' }}>
            <div style={{ background: '#141417', padding: '15px', borderRadius: '12px', border: '1px solid #27272a' }}>
              <div style={{ width: '100%', height: '360px', backgroundColor: '#27272a', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {profileImg ? (
                  <img src={profileImg} alt="About Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '5rem', color: '#64748b' }}>👨‍💻</span>
                )}
              </div>
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', margin: '0 0 30px 0' }}>
                Hi! I'm Parangat Dubey, and I love making websites look cool and easy to use. I'm both a system architecture planner and Full Stack Developer, so I combine the best of design aesthetics and scalable database integrations to construct ecosystems that people will truly enjoy using.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderBottom: '1px solid #27272a', paddingBottom: '30px', marginBottom: '30px' }}>
                <div><span style={{ fontWeight: '700', color: '#fff' }}>Name:</span> <span style={{ color: '#94a3b8' }}>Parangat Dubey</span></div>
                <div><span style={{ fontWeight: '700', color: '#fff' }}>College:</span> <span style={{ color: '#94a3b8' }}>GL Bajaj Group of Institution, Mathura</span></div>
                <div><span style={{ fontWeight: '700', color: '#fff' }}>From:</span> <span style={{ color: '#94a3b8' }}>India</span></div>
                <div><span style={{ fontWeight: '700', color: '#fff' }}>Email:</span> <span style={{ color: '#9333ea' }}>parangatdubey64@gmail.com</span></div>
              </div>
              <a href="/resume.pdf" download="Parangat_Dubey_Resume.pdf" style={{ padding: '12px 28px', backgroundColor: '#9333ea', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: '700', display: 'inline-block' }}>Download Resume</a>
            </div>
          </div>
        </section>


        {/* ==================== SECTION 3: QUALIFICATION ==================== */}
        <section id="qualification" style={{ padding: '100px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
            
            {/* LEFT COLUMN: EDUCATION SPLIT */}
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', borderBottom: '2px solid #27272a', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>Education</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}>
                    <span>GL BAJAJ GROUP OF INSTITUTION MATHURA</span>
                    <span style={{ color: '#9333ea' }}>2023 - 2027</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: '6px 0' }}>B.tech CSE</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>In my Engineering journey (B.Tech CSE), I've mastered coding languages, tackle real-world projects, and will be graduate with tech skills. Now I am ready for the next chapter!</p>
                </div>
                <div style={{ borderTop: '1px solid #1f1f23', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}>
                    <span>CENTRAL BOARD OF SECONDRY EDUCATION</span>
                    <span style={{ color: '#9333ea' }}>2021 - 2023</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: '6px 0' }}>Senior Secondary School</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>It was a transformative journey where I study interesting subjects, made lifelong friends, and faced exciting academic challenges.</p>
                </div>
                <div style={{ borderTop: '1px solid #1f1f23', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}>
                    <span>CENTRAL BOARD OF SECONDARY EDUCATION</span>
                    <span style={{ color: '#9333ea' }}>2019 - 2021</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: '6px 0' }}>High School</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>High school was like trying out different subjects. It was the starting point for me to grow and figure out what I want to do in the future.</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: TRAINING SPLIT */}
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', borderBottom: '2px solid #27272a', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>Training</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}>
                    <span>MERN Full-Stack</span>
                    <span style={{ color: '#9333ea' }}>2023 - 2026</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: '6px 0' }}>Web Development</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>In this, I learned to make websites and apps. From basic coding to creating cool online stuff, it's been like a speedy adventure in turning ideas into digital reality!</p>
                </div>
                <div style={{ borderTop: '1px solid #1f1f23', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}>
                    <span>OOPS with java by Apna College</span>
                    <span style={{ color: '#9333ea' }}>2021 - 2022</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: '6px 0' }}>Java Core Standard</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Java is like talking to computers using simple and clear instructions. It's a versatile language that helps in building websites, and solving problems.</p>
                </div>
                <div style={{ borderTop: '1px solid #1f1f23', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}>
                    <span>Apna College</span>
                    <span style={{ color: '#9333ea' }}>2024 - 2026</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: '6px 0' }}>JAVA + DSA Node</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>In this, I've learned to use Java for writing strong and reliable code. With DSA, I figured out smart ways to organize and process information.</p>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* ==================== SECTION 4: SKILLS ==================== */}
        <section id="skills" style={{ padding: '100px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', margin: 0 }}>Professional Skills</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px 30px' }}>
            
            {/* Front-End Node */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff', fontWeight: '700' }}>Front - End</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '700' }}>80 %</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 15px 0', minHeight: '65px' }}>I make websites that look cool and work smoothly, by using HTML, CSS, React, and Flask framework.</p>
              <div style={{ height: '4px', backgroundColor: '#1f1f23', borderRadius: '10px', position: 'relative' }}>
                <div style={{ width: '80%', height: '100%', backgroundColor: '#9333ea', borderRadius: '10px' }}></div>
                <div style={{ position: 'absolute', top: '-4px', left: '80%', width: '12px', height: '12px', backgroundColor: '#3f3f46', borderRadius: '50%', border: '2px solid #0d0d0f' }}></div>
              </div>
            </div>

            {/* Back-End Node */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff', fontWeight: '700' }}>Back - End</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '700' }}>65 %</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 15px 0', minHeight: '65px' }}>I make servers run smoothly in the background by managing schemas, logic routines and databases.</p>
              <div style={{ height: '4px', backgroundColor: '#1f1f23', borderRadius: '10px', position: 'relative' }}>
                <div style={{ width: '65%', height: '100%', backgroundColor: '#9333ea', borderRadius: '10px' }}></div>
                <div style={{ position: 'absolute', top: '-4px', left: '65%', width: '12px', height: '12px', backgroundColor: '#3f3f46', borderRadius: '50%', border: '2px solid #0d0d0f' }}></div>
              </div>
            </div>

            {/* Version Control Node */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff', fontWeight: '700' }}>Version Control</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '700' }}>78 %</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 15px 0', minHeight: '65px' }}>I have proficiency in using version control systems like Git and GitHub for clean code collaboration.</p>
              <div style={{ height: '4px', backgroundColor: '#1f1f23', borderRadius: '10px', position: 'relative' }}>
                <div style={{ width: '78%', height: '100%', backgroundColor: '#9333ea', borderRadius: '10px' }}></div>
                <div style={{ position: 'absolute', top: '-4px', left: '78%', width: '12px', height: '12px', backgroundColor: '#3f3f46', borderRadius: '50%', border: '2px solid #0d0d0f' }}></div>
              </div>
            </div>

            {/* API Development Node */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff', fontWeight: '700' }}>API Development</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '700' }}>72 %</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 15px 0', minHeight: '65px' }}>I build secure path structures for different script execution engines to share information smoothly.</p>
              <div style={{ height: '4px', backgroundColor: '#1f1f23', borderRadius: '10px', position: 'relative' }}>
                <div style={{ width: '72%', height: '100%', backgroundColor: '#9333ea', borderRadius: '10px' }}></div>
                <div style={{ position: 'absolute', top: '-4px', left: '72%', width: '12px', height: '12px', backgroundColor: '#3f3f46', borderRadius: '50%', border: '2px solid #0d0d0f' }}></div>
              </div>
            </div>

            {/* UI/UX Design Node */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff', fontWeight: '700' }}>UI/UX Design</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '700' }}>75 %</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 15px 0', minHeight: '65px' }}>I craft intuitive and balanced modern interface grids for an enjoyable digital layout experience.</p>
              <div style={{ height: '4px', backgroundColor: '#1f1f23', borderRadius: '10px', position: 'relative' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: '#9333ea', borderRadius: '10px' }}></div>
                <div style={{ position: 'absolute', top: '-4px', left: '75%', width: '12px', height: '12px', backgroundColor: '#3f3f46', borderRadius: '50%', border: '2px solid #0d0d0f' }}></div>
              </div>
            </div>

            {/* Security Handling Node */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff', fontWeight: '700' }}>Security Handling</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '700' }}>62 %</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 15px 0', minHeight: '65px' }}>I configure endpoint parameters to block malicious queries, ensuring data states remain safe.</p>
              <div style={{ height: '4px', backgroundColor: '#1f1f23', borderRadius: '10px', position: 'relative' }}>
                <div style={{ width: '62%', height: '100%', backgroundColor: '#9333ea', borderRadius: '10px' }}></div>
                <div style={{ position: 'absolute', top: '-4px', left: '62%', width: '12px', height: '12px', backgroundColor: '#3f3f46', borderRadius: '50%', border: '2px solid #0d0d0f' }}></div>
              </div>
            </div>

          </div>
        </section>


        {/* ==================== SECTION 5: PORTFOLIO ==================== */}
        <section id="portfolio" style={{ padding: '100px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#9333ea', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>My Portfolio</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', margin: '5px 0 0 0' }}>Recent Works</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {projects.length === 0 ? (
              <p style={{ color: '#64748b', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>Ecosystem stream is empty. Launch Admin Hub to sync projects.</p>
            ) : (
              projects.map((project) => (
                <div key={project._id} style={{ background: '#141417', border: '1px solid #27272a', borderRadius: '12px', padding: '25px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <button onClick={() => handleDelete(project._id)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.95rem' }}>✕</button>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: '0 0 10px 0' }}>{project.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '20px' }}>{project.description}</p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                      {project.tags && project.tags.map((tag, idx) => (
                        <span key={idx} style={{ backgroundColor: '#27272a', color: '#a78bfa', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{tag}</span>
                      ))}
                    </div>
                    {project.resourceLink && <a href={project.resourceLink} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Explore Project ↗</a>}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>


        {/* ==================== SECTION 6: CONTACT ==================== */}
        <section id="contact" style={{ padding: '100px 0 140px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: '#9333ea', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>Get In Touch</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', margin: '5px 0 0 0' }}>Contact Me</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '50px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingTop: '10px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', backgroundColor: '#141417', padding: '12px', borderRadius: '50%', border: '1px solid #27272a' }}>📞</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#fff' }}>Call at</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '3px' }}>
                    <a href="tel:+917088427211" style={{ color: '#94a3b8', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = '#9333ea'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                      +91 7088427211
                    </a>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', backgroundColor: '#141417', padding: '12px', borderRadius: '50%', border: '1px solid #27272a' }}>✉️</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#fff' }}>E-mail at</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '3px' }}>
                    <a href="mailto:parangatdubey64@gmail.com" style={{ color: '#94a3b8', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = '#9333ea'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                      parangatdubey64@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleContactSubmit}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" placeholder="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} required style={{ flex: 1, padding: '14px', borderRadius: '6px', backgroundColor: '#141417', border: '1px solid #27272a', color: '#fff', outline: 'none' }} />
                <input type="email" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required style={{ flex: 1, padding: '14px', borderRadius: '6px', backgroundColor: '#141417', border: '1px solid #27272a', color: '#fff', outline: 'none' }} />
              </div>
              <input type="text" placeholder="Subject" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} style={{ padding: '14px', borderRadius: '6px', backgroundColor: '#141417', border: '1px solid #27272a', color: '#fff', outline: 'none' }} />
              <textarea placeholder="Message" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} required style={{ padding: '14px', borderRadius: '6px', backgroundColor: '#141417', border: '1px solid #27272a', color: '#fff', minHeight: '120px', outline: 'none', resize: 'vertical' }}></textarea>
              <button type="submit" style={{ padding: '14px 28px', backgroundColor: '#9333ea', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', width: 'fit-content', alignSelf: 'flex-end', boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)' }}>Send Message</button>
            </form>
          </div>
        </section>

      </div>

      {/* FOOTER ACCORDING TO SCREENSHOTS */}
      <footer style={{ borderTop: '1px solid #1f1f23', padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d0d0f' }}>
        <span style={{ color: '#64748b', fontSize: '0.95rem' }}>© Made By Parangat Dubey</span>
        <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '0.9rem' }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }}>GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }}>LinkedIn</a>
        </div>
      </footer>

    </div>
  );
}