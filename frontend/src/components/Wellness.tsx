import React from 'react';
import { ArrowRight } from 'lucide-react';

const Wellness = () => {
  return (
    <section id="wellness" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Creating Wellness Together
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            We provide the resources and expertise you need to bring your health
            and wellness dreams to life, together.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center mb-16">
          <div className="lg:col-span-5" data-aos="fade-right">
            <img
              className="rounded-lg shadow-lg object-cover w-full"
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Two men talking in a garden"
            />
          </div>
          <div
            className="mt-8 lg:mt-0 lg:col-span-7 lg:pl-8"
            data-aos="fade-left"
          >
            <h3 className="text-2xl font-bold text-gray-900">
              Discover Our Collaborations
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              Together, we work to enhance health services, promote wellness
              programs, and improve the overall well-being of our community.
              Discover how these partnerships benefit you and contribute to the
              advancement of our health center.
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 font-medium flex items-center group transition-colors duration-200"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center mb-16">
          <div
            className="lg:col-span-7 order-2 lg:order-1"
            data-aos="fade-right"
          >
            <h3 className="text-2xl font-bold text-gray-900">
              Explore Our Initiatives
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              From preventive care programs to community health workshops and
              disease awareness campaigns, our initiatives are designed to
              address the diverse health needs of our community and promote a
              healthier life.
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 font-medium flex items-center group transition-colors duration-200"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          <div
            className="lg:col-span-5 order-1 lg:order-2 mb-8 lg:mb-0"
            data-aos="fade-left"
          >
            <img
              className="rounded-lg shadow-lg object-cover w-full"
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              alt="Doctor with child patient"
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-5" data-aos="fade-right">
            <img
              className="rounded-lg shadow-lg object-cover w-full"
              src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              alt="Group of diverse people"
            />
          </div>
          <div
            className="mt-8 lg:mt-0 lg:col-span-7 lg:pl-8"
            data-aos="fade-left"
          >
            <h3 className="text-2xl font-bold text-gray-900">
              Community Support Center
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              Our center offers emotional support, education, and practical
              resources to patients dealing with various health conditions. Our
              Community Support Center is here to help you every step of the
              way.
            </p>
            <div className="mt-8">
              <a
                href="#testimonials"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('testimonials')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-blue-600 hover:text-blue-500 font-medium flex items-center group transition-colors duration-200"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wellness;