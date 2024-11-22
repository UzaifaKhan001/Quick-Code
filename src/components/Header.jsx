import React from 'react';
import { Link } from 'react-scroll';
import './Header.css'; // Ensure you have your styles here

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src='logo.png' alt="" className="logo-img" /> QUICK CODE
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="about"
      spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>About</Link></li>
      <li><Link to="features"
      spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>Features</Link></li>
          <li><Link to="faq-container" spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>FAQs</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <Link to="/login" className="login-btn" >+ Log In
        </Link>
        <Link to="/signup" className="signup-btn">Sign Up →
        </Link>
      </div>
    </header>
  );
};

export default Header;
