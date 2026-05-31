import React from 'react';
import { Stethoscope, Calendar, ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <section id="services" className="py-16 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-aos="fade-right">
            <img
              className="rounded-lg shadow-lg object-cover w-full"
              src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2060&q=80"
              alt="Medical professional with stethoscope"
            />
          </div>
          <div className="mt-8 lg:mt-0 lg:col-span-7 lg:pl-8" data-aos="fade-left">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Our Services</div>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Health Services for Your Well-being
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              We provide comprehensive health services tailored to your individual needs.
            </p>
            
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="bg-gray-50 p-6 rounded-lg transition-all duration-300 hover:shadow-md" data-aos="zoom-in" data-aos-delay="100">
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-md text-blue-600">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">General Check-ups and Physical Exams</h3>
                <p className="mt-2 text-base text-gray-500">
                  Our comprehensive health check-ups help identify potential health issues early and ensure you're on track with your wellness goals.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg transition-all duration-300 hover:shadow-md" data-aos="zoom-in" data-aos-delay="200">
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-md text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Chronic Disease Management</h3>
                <p className="mt-2 text-base text-gray-500">
                  We provide ongoing care and management for chronic conditions like diabetes, hypertension, and heart disease with personalized treatment plans.
                </p>
              </div>
            </div>
            
            <div className="mt-8" data-aos="fade-up" data-aos-delay="300">
              <a 
                href="#healthnews"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('healthnews')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-500 transition-all duration-300"
              >
                View All Services
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;