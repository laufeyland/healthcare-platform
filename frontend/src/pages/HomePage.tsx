import React from 'react';
import { Heart, Clock, Calendar, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import HealthNews from '../components/HealthNews';
import Wellness from '../components/Wellness';
import Testimonials from '../components/Testimonials';

import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">
      <Navbar />
      
      <Hero />
      <div className="py-12 bg-gray-50" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2" data-aos="fade-up" data-aos-delay="100">
              <Heart className="text-blue-600" size={20} />
              <span className="text-gray-600 font-medium">Longum vitam</span>
            </div>
            <div className="flex items-center gap-2" data-aos="fade-up" data-aos-delay="200">
              <Clock className="text-blue-600" size={20} />
              <span className="text-gray-600 font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2" data-aos="fade-up" data-aos-delay="300">
              <Calendar className="text-blue-600" size={20} />
              <span className="text-gray-600 font-medium">Easy Scheduling</span>
            </div>
            <div className="flex items-center gap-2" data-aos="fade-up" data-aos-delay="400">
              <Users className="text-blue-600" size={20} />
              <span className="text-gray-600 font-medium">Expert Doctors</span>
            </div>
          </div>
        </div>
      </div>
      <Services  />
    
      <HealthNews />
      <Wellness />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default HomePage;
