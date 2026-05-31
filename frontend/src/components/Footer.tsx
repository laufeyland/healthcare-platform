import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">HealthTrust</span>
            </div>
            <p className="mt-4 text-gray-400">
              Supporting Your Wellness Journey
            </p>
            <p className="mt-2 text-sm text-gray-400">
              We're dedicated to providing accessible healthcare solutions that empower you to take control of your health.
            </p>
            <div className="mt-4">
              <button 
                onClick={() => scrollToSection('services')}
                className="text-blue-400 hover:text-blue-300 inline-flex items-center transition-colors duration-200"
              >
                View more services
              </button>
            </div>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-semibold mb-4">About HealthTrust</h3>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('wellness')} className="text-gray-400 hover:text-white transition-colors duration-200">Our Story</button></li>
              <li><button onClick={() => scrollToSection('wellness')} className="text-gray-400 hover:text-white transition-colors duration-200">Our Team</button></li>
              <li><button onClick={() => scrollToSection('wellness')} className="text-gray-400 hover:text-white transition-colors duration-200">Careers</button></li>
              <li><button onClick={() => scrollToSection('healthnews')} className="text-gray-400 hover:text-white transition-colors duration-200">News & Media</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</button></li>
            </ul>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg font-semibold mb-4">For Employees</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200">Employee Login</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Training Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Employee Handbook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Benefits Information</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Employee Assistance</a></li>
            </ul>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="400">
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="flex items-center mt-4">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <a href="mailto:info@healthtrust.com" className="text-gray-400 hover:text-white transition-colors duration-200">info@healthtrust.com</a>
            </div>
            <div className="flex items-center mt-4">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors duration-200">+1 (234) 567-890</a>
            </div>
            <div className="mt-6">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Terms & Conditions</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} HealthTrust. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;