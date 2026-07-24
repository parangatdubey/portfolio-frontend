import './App.css';
import React, { useState, useEffect } from 'react';

// Centralized Base URL
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
    <div className="portfolio-app">
      
      {/* STICKY GLASS NAVBAR */}
      <nav className="navbar">
        <div className="logo">Parangat Dubey</div>
        <div className="nav-menu">
          <ul className="nav-links">
            {['home', 'about', 'qualification', 'skills', 'portfolio', 'contact'].map(tab => (
              <li key={tab}>
                <a href={`#${tab}`} className={activeTab === tab ? 'active' : ''}>
                  {tab}
                </a>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowAdmin(!showAdmin)} className="admin-btn">
            {showAdmin ? 'Hide Hub ×' : 'Admin Hub ⚙️'}
          </button>
        </div>
      </nav>

      {/* DYNAMIC HUB ACCORDION */}
      {showAdmin && (
        <div className="admin-wrapper">
          <div className="admin-card">
            <div className="admin-avatar-section">
              <h3>🖼️ Social Profile Sync (Paste Image URL)</h3>
              <form onSubmit={handleUpdateAvatar} className="admin-form-row">
                <input type="text" placeholder="Paste image address/URL..." value={avatarInput} onChange={(e) => setAvatarInput(e.target.value)} required />
                <button type="submit" className="btn-purple">Update</button>
                {profileImg && <button type="button" onClick={handleResetAvatar} className="btn-danger">Reset</button>}
              </form>
            </div>
            <form onSubmit={handleAddProject} className="admin-form-col">
              <h3>➕ Live Portfolio Project Deployer</h3>
              <div className="admin-form-row">
                <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" placeholder="Tech Stacks" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>
              <input type="text" placeholder="Deployment / Github Link" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
              <button type="submit" className="btn-purple-full">Push Node Live</button>
            </form>
          </div>
        </div>
      )}

      <div className="main-content">

        {/* SECTION 1: HOME */}
        <section id="home" className="hero-section">
          <div className="hero-text">
            <h2>Hello</h2>
            <h1>
              I'm <span>Parangat Dubey</span> <br/>
              a <span className="highlight">Full Stack Developer</span>
            </h1>
            <p>
              Hi, I'm Parangat Dubey, a Full Stack Developer! I specialize in making websites look fantastic and easy to use. I combine colors, shapes, and backend storage to provide a great secure user experience. Let's turn your web vision into reality! 🌐✨
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-primary">Hire Me</a>
              <a href="#portfolio" className="btn btn-secondary">Portfolio</a>
            </div>
          </div>
          
          <div className="hero-badge-container">
            <div className="pd-badge">
              {profileImg ? (
                <img src={profileImg} alt="Parangat" className="badge-img" />
              ) : (
                <span>PD</span>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: ABOUT */}
        <section id="about" className="section">
          <div className="section-header">
            <span className="subtitle">Who Am I?</span>
            <h2>I'm Parangat Dubey, a Full Stack Web Architect</h2>
          </div>
          <div className="about-grid">
            <div className="avatar-box">
              <div className="avatar-inner">
                {profileImg ? (
                  <img src={profileImg} alt="About Avatar" className="badge-img" />
                ) : (
                  <span className="avatar-icon">👨‍💻</span>
                )}
              </div>
            </div>
            <div className="about-details">
              <p>
                Hi! I'm Parangat Dubey, and I love making websites look cool and easy to use. I'm both a system architecture planner and Full Stack Developer, so I combine the best of design aesthetics and scalable database integrations to construct ecosystems that people will truly enjoy using.
              </p>
              <div className="info-grid">
                <div><strong>Name:</strong> <span>Parangat Dubey</span></div>
                <div><strong>College:</strong> <span>GL Bajaj Group of Institution, Mathura</span></div>
                <div><strong>From:</strong> <span>India</span></div>
                <div><strong>Email:</strong> <span className="highlight-text">parangatdubey64@gmail.com</span></div>
              </div>
              <a href="/resume.pdf" download="Parangat_Dubey_Resume.pdf" className="btn btn-primary">Download Resume</a>
            </div>
          </div>
        </section>

        {/* SECTION 3: QUALIFICATION */}
        <section id="qualification" className="section">
          <div className="split-grid">
            <div>
              <h2 className="column-title">Education</h2>
              <div className="timeline-list">
                <div className="timeline-item">
                  <div className="timeline-meta">
                    <span>GL BAJAJ GROUP OF INSTITUTION MATHURA</span>
                    <span className="highlight-text">2023 - 2027</span>
                  </div>
                  <h4>B.tech CSE</h4>
                  <p>In my Engineering journey (B.Tech CSE), I've mastered coding languages, tackle real-world projects, and will be graduate with tech skills. Now I am ready for the next chapter!</p>
                </div>
                <div className="timeline-item border-top">
                  <div className="timeline-meta">
                    <span>CENTRAL BOARD OF SECONDRY EDUCATION</span>
                    <span className="highlight-text">2021 - 2023</span>
                  </div>
                  <h4>Senior Secondary School</h4>
                  <p>It was a transformative journey where I study interesting subjects, made lifelong friends, and faced exciting academic challenges.</p>
                </div>
                <div className="timeline-item border-top">
                  <div className="timeline-meta">
                    <span>CENTRAL BOARD OF SECONDARY EDUCATION</span>
                    <span className="highlight-text">2019 - 2021</span>
                  </div>
                  <h4>High School</h4>
                  <p>High school was like trying out different subjects. It was the starting point for me to grow and figure out what I want to do in the future.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="column-title">Training</h2>
              <div className="timeline-list">
                <div className="timeline-item">
                  <div className="timeline-meta">
                    <span>MERN Full-Stack</span>
                    <span className="highlight-text">2023 - 2026</span>
                  </div>
                  <h4>Web Development</h4>
                  <p>In this, I learned to make websites and apps. From basic coding to creating cool online stuff, it's been like a speedy adventure in turning ideas into digital reality!</p>
                </div>
                <div className="timeline-item border-top">
                  <div className="timeline-meta">
                    <span>OOPS with java by Apna College</span>
                    <span className="highlight-text">2021 - 2022</span>
                  </div>
                  <h4>Java Core Standard</h4>
                  <p>Java is like talking to computers using simple and clear instructions. It's a versatile language that helps in building websites, and solving problems.</p>
                </div>
                <div className="timeline-item border-top">
                  <div className="timeline-meta">
                    <span>Apna College</span>
                    <span className="highlight-text">2024 - 2026</span>
                  </div>
                  <h4>JAVA + DSA Node</h4>
                  <p>In this, I've learned to use Java for writing strong and reliable code. With DSA, I figured out smart ways to organize and process information.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SKILLS */}
        <section id="skills" className="section">
          <div className="section-header">
            <h2>Professional Skills</h2>
          </div>
          <div className="skills-container">
            {[
              { name: "Front - End", val: "80%", desc: "I make websites that look cool and work smoothly, by using HTML, CSS, React, and Flask framework." },
              { name: "Back - End", val: "65%", desc: "I make servers run smoothly in the background by managing schemas, logic routines and databases." },
              { name: "Version Control", val: "78%", desc: "I have proficiency in using version control systems like Git and GitHub for clean code collaboration." },
              { name: "API Development", val: "72%", desc: "I build secure path structures for different script execution engines to share information smoothly." },
              { name: "UI/UX Design", val: "75%", desc: "I craft intuitive and balanced modern interface grids for an enjoyable digital layout experience." },
              { name: "Security Handling", val: "62%", desc: "I configure endpoint parameters to block malicious queries, ensuring data states remain safe." }
            ].map((skill, i) => (
              <div key={i} className="skill-item">
                <div className="skill-head">
                  <h4>{skill.name}</h4>
                  <span>{skill.val}</span>
                </div>
                <p>{skill.desc}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: skill.val }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: PORTFOLIO */}
        <section id="portfolio" className="section">
          <div className="section-header">
            <span className="subtitle">My Portfolio</span>
            <h2>Recent Works</h2>
          </div>
          <div className="projects-grid">
            {projects.length === 0 ? (
              <p className="empty-msg">Ecosystem stream is empty. Launch Admin Hub to sync projects.</p>
            ) : (
              projects.map((project) => (
                <div key={project._id} className="project-card">
                  <button onClick={() => handleDelete(project._id)} className="delete-btn">✕</button>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div>
                    <div className="tech-tags">
                      {project.tags && project.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                    {project.resourceLink && <a href={project.resourceLink} target="_blank" rel="noreferrer" className="project-link">Explore Project ↗</a>}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 6: CONTACT */}
        <section id="contact" className="section">
          <div className="section-header">
            <span className="subtitle">Get In Touch</span>
            <h2>Contact Me</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <span className="icon">📞</span>
                <div>
                  <div className="label">Call at</div>
                  <a href="tel:+917088427211">+91 7088427211</a>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon">✉️</span>
                <div>
                  <div className="label">E-mail at</div>
                  <a href="mailto:parangatdubey64@gmail.com">parangatdubey64@gmail.com</a>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <input type="text" placeholder="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                <input type="email" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
              </div>
              <input type="text" placeholder="Subject" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} />
              <textarea placeholder="Message" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} required></textarea>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="footer-bar">
        <span>© Made By Parangat Dubey</span>
        <div className="social-links">
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>

    </div>
  );
}