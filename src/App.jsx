import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'qualification', 'skills', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="portfolio-app">
      {/* STICKY GLASS NAVBAR */}
      <nav className="navbar">
        <div className="logo">Parangat Dubey</div>
        <ul className="nav-links">
          <li>
            <a href="#home" className={activeSection === 'home' ? 'active' : ''}>Home</a>
          </li>
          <li>
            <a href="#about" className={activeSection === 'about' ? 'active' : ''}>About</a>
          </li>
          <li>
            <a href="#qualification" className={activeSection === 'qualification' ? 'active' : ''}>Qualification</a>
          </li>
          <li>
            <a href="#skills" className={activeSection === 'skills' ? 'active' : ''}>Skills</a>
          </li>
          <li>
            <a href="#portfolio" className={activeSection === 'portfolio' ? 'active' : ''}>Portfolio</a>
          </li>
          <li>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact</a>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="main-content">
        {/* HERO SECTION */}
        <section id="home" className="hero-section">
          <div className="hero-text">
            <h2>Hello</h2>
            <h1>
              I'm <span>Parangat Dubey</span> <br />a <span className="highlight">Full Stack Developer</span>
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
              <span>PD</span>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="section">
          <h2>About Me</h2>
          <p>
            I am a passionate Full Stack Software Developer with expertise in building responsive, high-performance web applications using modern tech stacks.
          </p>
        </section>

        {/* QUALIFICATION SECTION */}
        <section id="qualification" className="section">
          <h2>Qualification</h2>
          <p>Bachelor of Science in Computer Science</p>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="section">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skill-card">React.js</div>
            <div className="skill-card">Node.js</div>
            <div className="skill-card">Express.js</div>
            <div className="skill-card">MongoDB</div>
            <div className="skill-card">JavaScript / C++</div>
            <div className="skill-card">Tailwind CSS</div>
          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section id="portfolio" className="section">
          <h2>Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3>Forjix</h3>
              <p>Customized Placement Preparation Web Ecosystem built using MERN Stack.</p>
              <div className="tech-tags">
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">MongoDB</span>
              </div>
            </div>
            <div className="project-card">
              <h3>NearNest</h3>
              <p>Hostel accommodation platform prototype with multi-role governance dashboards.</p>
              <div className="tech-tags">
                <span className="tag">React</span>
                <span className="tag">Express</span>
                <span className="tag">MongoDB</span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="section">
          <h2>Contact Me</h2>
          <p>Feel free to reach out for collaborations or project inquiries!</p>
          <a href="mailto:parangatdubey@example.com" className="btn btn-primary">Get In Touch</a>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Parangat Dubey. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;