import React, { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Award,
  Users,
  Menu,
  X,
  Send,
  Moon,
  Sun,
  MessageCircle,
  Heart,
  Zap,
  Sparkles,
  Smile,
  Scissors,
  Activity,
  Thermometer,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const clinicImages = {
  hero: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2070",
  doctor: "https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=2070",
  service1: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000",
  service2: "https://images.unsplash.com/photo-1460676747077-e4044638c011?auto=format&fit=crop&q=80&w=1000",
  service3: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000"
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isSending, setIsSending] = useState(false);

  const dentalProblems = [
    "Toothache",
    "Missing Teeth",
    "Teeth straightening",
    "Smile Makeover",
    "Teeth Cleaning",
    "Teeth Whitening",
    "Yellow Teeth",
    "Lost Filling",
    "Emergency Dentist",
    "Wisdom Teeth",
    "Broken Chipped Tooth",
    "Receding Gums",
    "Gum Disease",
    "Teeth Grinding",
    "Jaw Pain",
    "Bad Breath",
    "Sensitive & Sore Teeth",
    "Tooth Abscess",
    "Mouth Sores",
    "Replacing Amalgam Fillings"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const services = [
    { title: "General Dentistry", desc: "Routine checkups, cleaning, and preventive care for all ages.", icon: <ShieldCheck size={24} /> },
    { title: "Cosmetic Dentistry", desc: "Teeth whitening, veneers, and smile makeovers to boost your confidence.", icon: <Award size={24} /> },
    { title: "Pediatric Dentistry", desc: "Gentle and specialized dental care for your little ones.", icon: <Users size={24} /> },
    { title: "Orthodontics", desc: "Aligning your teeth with modern braces and invisible aligners.", icon: <Calendar size={24} /> },
    { title: "Teeth Cleaning", desc: "Professional scaling and polishing for a healthy, debris-free mouth.", icon: <Zap size={24} /> },
    { title: "Teeth Whitening", desc: "Advanced whitening treatments for a brighter, more radiant smile.", icon: <Sparkles size={24} /> },
    { title: "Emergency Dentistry", desc: "Urgent care for toothaches, accidents, and dental emergencies.", icon: <Activity size={24} /> },
    { title: "Smile Makeover", desc: "Comprehensive aesthetic treatments to transform your complete look.", icon: <Smile size={24} /> },
    { title: "Tooth Extraction", desc: "Safe and painless removal of damaged or wisdom teeth.", icon: <Scissors size={24} /> },
    { title: "Restorative Fillings", desc: "High-quality, long-lasting fillings for decayed or chipped teeth.", icon: <ShieldCheck size={24} /> },
    { title: "Root Canal Therapy", desc: "Expert treatment to save infected teeth and relieve deep pain.", icon: <Thermometer size={24} /> },
    { title: "Periodontal Care", desc: "Treating gum disease and maintaining healthy supporting tissues.", icon: <Heart size={24} /> }
  ];

  const branches = [
    {
      name: "Model Town Branch",
      location: "A Block Store Market",
      address: "Shop 43-44, A-Block, Store Market, Model Town, Lahore, 54700",
      phone: "0345 8477001",
      hours: "9:00 AM - 3:00 PM (Mon-Sat)",
      link: "https://maps.app.goo.gl/gpGAQsisrnXnhstQ7",
      startTime: "09:00",
      endTime: "15:00"
    },
    {
      name: "DHA Branch",
      address: "DHA Phase 5/6, Lahore",
      phone: "+92 323 7792138",
      hours: "3:30 PM - 9:00 PM",
      link: "https://maps.app.goo.gl/pM7V679B6S8K9mG68",
      startTime: "15:30",
      endTime: "21:00"
    }
  ];

  // Generate time slots based on branch
  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const hour12 = currentHour % 12 || 12;
      const ampm = currentHour < 12 ? 'AM' : 'PM';
      const timeStr = `${hour12}:${currentMin.toString().padStart(2, '0')} ${ampm}`;
      slots.push(timeStr);

      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }

    return slots;
  };

  const getAvailableTimeSlots = () => {
    if (!selectedBranch) return [];
    const branchIndex = selectedBranch === 'model-town' ? 0 : 1;
    const branch = branches[branchIndex];
    return generateTimeSlots(branch.startTime, branch.endTime);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBranch || !selectedTimeSlot) {
      alert('Please fill out all required fields');
      return;
    }

    setIsSending(true);

    const branchName = selectedBranch === 'model-town' ? 'Model Town' : 'DHA';

    // Construct Google Calendar URL
    const eventTitle = `Dental Appointment: ${fullName}`;
    const eventDate = preferredDate.replace(/-/g, '');
    const startTime = selectedTimeSlot.includes('AM') ? '090000' : '153000';
    const endTime = selectedTimeSlot.includes('AM') ? '100000' : '163000';

    const details = `Patient: ${fullName}%0ANumber: ${phoneNumber}%0ABranch: ${branchName}%0AProblem: ${selectedProblem || 'Not specified'}%0ATime Slot: ${selectedTimeSlot}`;
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}T${startTime}/${eventDate}T${endTime}&details=${details}&add=mannan796@gmail.com`;

    // Attempt to send email through EmailJS (User needs to set up service)
    try {
      // Note: You must initialize emailjs with your public key in main.jsx or here
      // Replace with your real service, template and user IDs from emailjs.com
      const templateParams = {
        to_email: 'mannan796@gmail.com',
        from_name: fullName,
        phone_number: phoneNumber,
        branch: branchName,
        problem: selectedProblem || 'Not specified',
        date: preferredDate,
        time_slot: selectedTimeSlot
      };

      // We'll show an alert guide since we don't have the keys yet
      console.log('Pushing email to mannan796@gmail.com with details:', templateParams);

      // Open calendar invite
      window.open(calendarUrl, '_blank');

      alert(`Booking request initiated!\n\n1. Check your email (mannan796@gmail.com) for the alert.\n2. Save the Google Calendar event that just opened to confirm.`);
    } catch (error) {
      console.error('Email failed:', error);
      window.open(calendarUrl, '_blank');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <span className="gradient-text">Dental</span> Enclosure
          </div>

          <div className="desktop-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#branches">Branches</a>
            <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="btn btn-primary" onClick={() => document.getElementById('appointment').scrollIntoView()}>Book Now</button>
          </div>

          <div className="mobile-nav-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu glass"
          >
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="#branches" onClick={() => setIsMenuOpen(false)}>Branches</a>
            <button className="btn btn-primary" onClick={() => { setIsMenuOpen(false); document.getElementById('appointment').scrollIntoView(); }}>Book Now</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header id="home" className="hero-section text-center">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">Your Smile, Our <span className="gradient-text">Masterpiece</span></h1>
            <p className="hero-subtitle">Experience world-class dental care with Dr. Farrah Mushtaq at Dental Enclosure. Modern clinics in Model Town & DHA Lahore.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => document.getElementById('appointment').scrollIntoView()}>Get Started</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="hero-image-container"
          >
            <img src={clinicImages.hero} alt="Modern Dental Clinic" className="hero-image" />
          </motion.div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="section bg-muted">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="gradient-text">Our Services</h2>
            <p>Comprehensive dental solutions tailored to your needs.</p>
          </div>
          <div className="grid grid-cols-4">
            {services.map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="card service-card"
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="gradient-text">Our Locations</h2>
            <p>Conveniently located to serve you better across Lahore.</p>
          </div>
          <div className="grid grid-cols-2">
            {branches.map((branch, i) => (
              <div key={i} className="card branch-card glass">
                <div className="branch-info">
                  <h3>{branch.name}</h3>
                  {branch.location && <p className="branch-location">{branch.location}</p>}
                  <p><MapPin size={18} className="icon-inline" /> {branch.address}</p>
                  <p><Phone size={18} className="icon-inline" /> {branch.phone}</p>
                  <p><Clock size={18} className="icon-inline" /> {branch.hours}</p>
                  <div className="branch-actions">
                    <a href={branch.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">View on Map</a>
                    <a href={`tel:${branch.phone.replace(/[\s+]+/g, '')}`} className="btn btn-outline btn-sm">
                      <Phone size={16} style={{ marginRight: '6px' }} /> Call
                    </a>
                    <a
                      href={`https://wa.me/${branch.phone.replace(/[\s+]+/g, '').startsWith('0') ? '92' + branch.phone.replace(/[\s+]+/g, '').slice(1) : branch.phone.replace(/[\s+]+/g, '')}?text=Hello%20Dental%20Enclosure%2C%20I'd%20like%20to%20book%20an%20appointment.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm"
                    >
                      <MessageCircle size={16} style={{ marginRight: '6px' }} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Form Section */}
      <section id="appointment" className="section bg-muted overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-2 appointment-grid">
            <div className="appointment-text">
              <h2 className="gradient-text">Book an Appointment</h2>
              <p>Schedule your visit today and take the first step towards a healthier, brighter smile. Our team will contact you shortly to confirm your slot.</p>

              <div className="benefits">
                <div className="benefit-item">
                  <ChevronRight size={20} className="icon-accent" />
                  <span>Experienced Specialists</span>
                </div>
                <div className="benefit-item">
                  <ChevronRight size={20} className="icon-accent" />
                  <span>Painless Treatment</span>
                </div>
                <div className="benefit-item">
                  <ChevronRight size={20} className="icon-accent" />
                  <span>State-of-the-art Equipment</span>
                </div>
              </div>
            </div>

            <div className="card appointment-form-card glass">
              <form className="appointment-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="e.g. 0300 1234567" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Preferred Branch</label>
                  <select required value={selectedBranch} onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    setSelectedTimeSlot('');
                  }}>
                    <option value="">Select a branch</option>
                    <option value="model-town">Model Town (9 AM - 3 PM)</option>
                    <option value="dha">DHA (3:30 PM - 9 PM)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Dental Problem (Optional)</label>
                  <select value={selectedProblem} onChange={(e) => setSelectedProblem(e.target.value)}>
                    <option value="">Select a dental problem</option>
                    {dentalProblems.map((problem, idx) => (
                      <option key={idx} value={problem}>{problem}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input type="date" required value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
                </div>
                {selectedBranch && (
                  <div className="form-group">
                    <label>Preferred Time Slot</label>
                    <div className="time-slots-grid">
                      {getAvailableTimeSlots().map((slot, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`time-slot-chip ${selectedTimeSlot === slot ? 'selected' : ''}`}
                          onClick={() => setSelectedTimeSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {selectedTimeSlot && (
                      <p className="selected-time-display">Selected: <strong>{selectedTimeSlot}</strong></p>
                    )}
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-full mt-2" disabled={isSending}>
                  {isSending ? 'Sending...' : <><Send size={18} style={{ marginRight: '8px' }} /> Send Request</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="grid grid-cols-3 footer-content">
            <div className="footer-brand">
              <h2 className="gradient-text">Dental Enclosure</h2>
              <p>Owned by Dr. Farrah Mushtaq (BDS)</p>
              <div className="social-links">
                <a href="https://www.instagram.com/dentalenclosurelhr/?hl=en" target="_blank" rel="noopener noreferrer"><Instagram /></a>
                <a href="https://www.facebook.com/DentalEnclosure/" target="_blank" rel="noopener noreferrer"><Facebook /></a>
              </div>
            </div>
            <div>
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#branches">Branches</a></li>
                <li><a href="#appointment">Appointment</a></li>
              </ul>
            </div>
            <div>
              <h3>Contact Info</h3>
              <p>Model Town: 0345 8477001</p>
              <p>DHA: +92 323 7792138</p>
              <p>Email: info@dentalenclosure.com</p>
              <div className="footer-contact-btns mt-2">
                <a href="tel:03458477001" className="btn btn-primary btn-sm w-full mb-1">
                  <Phone size={14} style={{ marginRight: '6px' }} /> Call Model Town
                </a>
                <a href="tel:923237792138" className="btn btn-primary btn-sm w-full mb-1">
                  <Phone size={14} style={{ marginRight: '6px' }} /> Call DHA
                </a>
                <a
                  href="https://wa.me/923458477001?text=Hello%20Dental%20Enclosure%2C%20I'd%20like%20to%20book%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm w-full mb-1"
                >
                  <MessageCircle size={14} style={{ marginRight: '6px' }} /> WhatsApp Model Town
                </a>
                <a
                  href="https://wa.me/923237792138?text=Hello%20Dental%20Enclosure%2C%20I'd%20like%20to%20book%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm w-full"
                >
                  <MessageCircle size={14} style={{ marginRight: '6px' }} /> WhatsApp DHA
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom text-center">
            <p>&copy; {new Date().getFullYear()} Dental Enclosure. Created for Dr. Farrah Mushtaq.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          display: flex;
          align-items: center;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        .nav.scrolled {
          background: var(--background);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          height: 70px;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .desktop-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .desktop-links a {
          text-decoration: none;
          color: var(--foreground);
          font-weight: 500;
          transition: color 0.2s;
        }
        .desktop-links a:hover {
          color: var(--primary);
        }
        .theme-toggle-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--foreground);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .theme-toggle-btn:hover {
          background: var(--muted);
          border-color: var(--primary);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--foreground);
        }
        .btn-outline:hover {
          background: var(--muted);
          border-color: var(--primary);
        }
        
        .btn-whatsapp {
          background: #25D366;
          color: white;
          border: none;
        }
        .btn-whatsapp:hover {
          background: #128C7E;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }
        
        .branch-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        
        .footer-contact-btns {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .mb-1 { margin-bottom: 0.5rem; }
        .mobile-nav-actions {
          display: none;
          gap: 0.75rem;
          align-items: center;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--foreground);
          cursor: pointer;
        }
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 1.5rem;
          right: 1.5rem;
          padding: 2rem;
          border-radius: var(--radius);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          z-index: 999;
          text-align: center;
        }
        .mobile-menu a {
          text-decoration: none;
          color: var(--foreground);
          font-size: 1.2rem;
          font-weight: 600;
        }

        .hero-section {
          padding: 10rem 0 5rem;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }
        .hero-title {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--muted-foreground);
          max-width: 700px;
          margin: 0 auto 2.5rem;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
        }
        .hero-image-container {
          border-radius: 2rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .hero-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .bg-muted {
          background-color: var(--muted);
        }

        .card {
          padding: 2.5rem;
          border-radius: var(--radius);
          background: var(--card);
          border: 1px solid var(--border);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-card {
          text-align: center;
        }
        .service-icon {
          width: 60px;
          height: 60px;
          background: var(--primary);
          color: white;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .service-card h3 {
          margin-bottom: 1rem;
        }
        .service-card p {
          color: var(--muted-foreground);
          font-size: 0.95rem;
        }

        .branch-card {
          display: flex;
          align-items: center;
        }
        .branch-location {
          color: var(--muted-foreground);
          font-size: 0.9rem;
          font-style: italic;
          margin-top: 0.25rem;
          margin-bottom: 1rem;
        }
        .icon-inline {
          vertical-align: middle;
          margin-right: 8px;
          color: var(--primary);
        }
        .mt-2 { margin-top: 1rem; }
        .w-full { width: 100%; }

        .appointment-grid {
          align-items: center;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          font-weight: 500;
        }
        .icon-accent { color: var(--accent); }

        .appointment-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .form-group input, .form-group select {
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          font-family: inherit;
        }

        .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .time-slot-chip {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 2px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .time-slot-chip:hover {
          border-color: var(--primary);
          background: var(--muted);
          transform: translateY(-2px);
        }

        .time-slot-chip.selected {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .selected-time-display {
          margin-top: 1rem;
          padding: 0.75rem;
          background: var(--muted);
          border-radius: 0.5rem;
          text-align: center;
          color: var(--foreground);
          font-size: 0.95rem;
        }

        .selected-time-display strong {
          color: var(--primary);
        }

        .footer {
          padding: 5rem 0 2rem;
          background: var(--background);
          border-top: 1px solid var(--border);
        }
        .footer-content {
          margin-bottom: 4rem;
        }
        .footer-brand h2 { margin-bottom: 1rem; }
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .social-links a {
          color: var(--muted-foreground);
          transition: color 0.2s;
        }
        .social-links a:hover {
          color: var(--primary);
        }
        .footer h3 {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        .footer ul {
          list-style: none;
        }
        .footer ul li {
          margin-bottom: 0.75rem;
        }
        .footer ul li a {
          text-decoration: none;
          color: var(--muted-foreground);
          transition: color 0.2s;
        }
        .footer ul li a:hover {
          color: var(--primary);
        }
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--border);
          color: var(--muted-foreground);
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .mobile-nav-actions { display: flex; }
          .mobile-menu-btn { display: block; }
          .desktop-links { display: none; }
          .hero-title { font-size: 2.5rem; }
          .grid-cols-4, .grid-cols-3, .grid-cols-2 { grid-template-columns: 1fr; }
          .appointment-grid { gap: 3rem; }
          .time-slots-grid {
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default App;
