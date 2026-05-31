import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      content: "HealthTrust Has Been A Lifesaver For Me. The Ability To Consult With A Doctor Anytime, Anywhere Has Made Managing My Health So Much Easier. The Doctors Are Knowledgeable, The Interface Is Straightforward, And I Always Feel Heard And Cared For.",
      author: "John Dayne",
      role: "Customer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      id: 2,
      content: "As someone with a chronic condition, having access to healthcare professionals through HealthTrust has been invaluable. The convenience of virtual consultations saves me time and stress.",
      author: "Sarah Johnson",
      role: "Patient",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      id: 3,
      content: "The quality of care I've received through HealthTrust is exceptional. The doctors take their time to listen and provide thorough explanations. It's healthcare that truly puts patients first.",
      author: "Michael Chen",
      role: "Customer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4" data-aos="fade-up">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Our Testimonials</h2>
        </div>

        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
          <div className="md:grid md:grid-cols-12">
            <div className="md:col-span-4 bg-gray-100">
              <img 
                className="h-full w-full object-cover transition-opacity duration-500" 
                src={currentTestimonial.avatar} 
                alt={currentTestimonial.author} 
              />
            </div>
            <div className="md:col-span-8 p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote>
                  <p className="text-xl font-medium text-gray-900 mb-8">
                    "{currentTestimonial.content}"
                  </p>
                </blockquote>
              </div>
              <div>
                <div className="flex items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{currentTestimonial.author}</p>
                    <p className="text-base text-gray-500">{currentTestimonial.role}</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <div className="flex space-x-2">
                    {testimonials.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
                      ></span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={prevTestimonial}
                      className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;