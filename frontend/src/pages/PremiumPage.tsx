import React, { useState } from 'react';
import { Crown, Check, X, ArrowRight, Shield, Clock, Phone, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api/api';

const PremiumPage = () => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const benefits = [
    {
      title: 'Priority Appointments',
      description: 'Get priority booking and instant confirmation for all appointments',
      icon: Crown
    },
    {
      title: 'Extended Consultations',
      description: '45-minute consultations instead of standard 30-minute sessions',
      icon: Clock
    },
    {
      title: '24/7 Support',
      description: 'Direct access to medical professionals through our premium hotline',
      icon: Phone
    },
    {
      title: 'Specialist Access',
      description: 'Direct booking with specialists without referral requirements',
      icon: Users
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setError('');
    setSuccess(false);

    if (!couponCode) {
      setError('Please enter a coupon code.');
      setIsApplying(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        setIsApplying(false);
        return;
      }

      const response = await api.post(
        '/users/redeem/',
        { coupon_code: couponCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setSuccess(true);
        const userData = sessionStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          parsed.premium_status = true;
          sessionStorage.setItem('userData', JSON.stringify(parsed));
        }

      }
    } catch (err) {

      const errorMessage =
        (err as unknown as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to redeem coupon. Please try again.';
      setError(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50">
        <Navbar />
        <div className='h-8'></div>
        <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8" data-aos="zoom-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome to Premium!</h2>
              <p className="mt-2 text-lg text-gray-600">
                Your account has been successfully upgraded to premium status.
              </p>
            </div>

            <div className="mt-8">
              <div className="rounded-lg bg-amber-50 p-6 border border-amber-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Your premium benefits are now active
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        You now have access to all premium features. Enjoy priority bookings,
                        extended consultations, and premium support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Start Exploring Premium Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center" data-aos="fade-up">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Upgrade to Premium
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Unlock exclusive benefits and enhance your healthcare experience with our premium membership.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-100 text-amber-600 mx-auto">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-lg mx-auto" data-aos="fade-up" data-aos-delay="400">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-10 w-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Enter Your Premium Coupon Code
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="coupon" className="sr-only">
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="coupon"
                  name="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter your coupon code"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isApplying}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                  isApplying ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isApplying ? 'Applying...' : 'Upgrade Now'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need a coupon code?{' '}
                <a href="#" className="font-medium text-amber-600 hover:text-amber-500">
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PremiumPage;
