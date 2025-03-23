
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-secondary/30 pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">EV</span>
              </div>
              <h2 className="text-xl font-semibold">E-VotingSystem</h2>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              A secure, transparent digital voting platform built with advanced security measures and blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/elections" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Elections
                </Link>
              </li>
              <li>
                <Link to="/candidates" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Candidates
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Help */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  contact@evotingsystem.com
                </span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  +91 1234567890
                </span>
              </li>
              <li className="text-sm text-muted-foreground mt-2">
                Election Commission Building,<br />
                Nirvachan Sadan, Ashoka Road,<br />
                New Delhi - 110001, India
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-muted/30 mt-10 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} E-VotingSystem. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
