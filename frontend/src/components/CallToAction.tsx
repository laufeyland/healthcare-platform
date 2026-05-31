import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section id="cta" className="bg-blue-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Master Your Wellness, Live Fully
            </h2>
            <p className="mt-3 text-lg text-blue-100">
              By cultivating healthy habits and embracing balance, you'll unlock your full potential and experience a life of vitality and purpose.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 flex justify-end" data-aos="fade-left">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/book-appointment"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;