import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Clock,
  Check,
  Info,
  Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api/api';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', 
  '11:00', '11:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30'
];

const BookingPage = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservedTimes, setReservedTimes] = useState<{ [date: string]: Set<string> }>({});
  const navigate = useNavigate();


  useEffect(() => {
    fetchReservedTimes(setReservedTimes);
  }, []);

  const handleDateChange = (value: Value) => {
    setDate(value);
    setSelectedTimeSlot(null);
    fetchReservedTimes(setReservedTimes);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleSubmit = async () => {
    if (!date || !selectedTimeSlot) return;

    setIsLoading(true);
    setError(null);

    try {
      const selectedDate = date instanceof Date ? date : new Date(date[0] || new Date());
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number);

      selectedDate.setHours(hours, minutes, 0, 0);
      const appointment_date = selectedDate.toISOString();


      const response = await api.post('users/appointments/create/', {
        appointment_date,
      });
      setBookingReference(response.data.id || `APP-${Date.now()}`);
      setBookingComplete(true);
    } catch (err) {

      const errorMessage = (err as any)?.response?.data?.error || "Failed to book appointment. Please try again.";
      setError(errorMessage);
  
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          navigate('/login');
        }
      }
    } finally {
      setIsLoading(false);
    }
    
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className='h-8'></div>
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden" data-aos="fade-up">
            <div className="bg-blue-600 px-6 py-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
                  <Check className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center">Appointment Confirmed!</h1>
              <p className="text-center text-blue-100 mt-2">Your appointment has been successfully scheduled</p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reference Number</p>
                    <p className="text-lg font-medium text-gray-900">{bookingReference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="text-lg font-medium text-gray-900">
                      {date instanceof Date ? formatDate(date) : ''} at {selectedTimeSlot}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-lg font-medium text-gray-900">30 min</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Please arrive 15 minutes before your appointment time. If you need to cancel or reschedule, 
                      please do so at least 24 hours in advance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link 
                  to="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className='h-8'></div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Book Your Appointment
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Choose your preferred date and time.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden" data-aos="fade-up">
            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
                  <div className="calendar-container">
                    <Calendar 
                      onChange={handleDateChange} 
                      value={date} 
                      minDate={new Date()}
                      className="rounded-lg border shadow-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
                  {date ? (
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((timeSlot) => {
                        let isReserved = false;
                        if (date) {
                          const d = date instanceof Date ? date : new Date(date[0] || new Date());
                          const dateStr = d.toISOString().slice(0, 10);
                          isReserved = reservedTimes[dateStr]?.has(timeSlot);
                        }
                        return (
                          <div
                            key={timeSlot}
                            onClick={() => !isReserved && handleTimeSlotSelect(timeSlot)}
                            className={`px-4 py-3 border rounded-md cursor-pointer text-center transition-all duration-200 ${
                              selectedTimeSlot === timeSlot
                                ? 'bg-blue-600 text-white border-blue-600'
                                : isReserved
                                  ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                  : 'border-gray-300 hover:border-blue-300'
                            }`}
                            style={isReserved ? { pointerEvents: 'none', opacity: 0.6 } : {}}
                          >
                            <div className="flex items-center justify-center">
                              <Clock className={`h-4 w-4 mr-2 ${selectedTimeSlot === timeSlot ? 'text-white' : isReserved ? 'text-gray-300' : 'text-gray-400'}`} />
                              <span>{timeSlot}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 border border-dashed border-gray-300 rounded-md">
                      <p className="text-gray-500">Please select a date first</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!date || !selectedTimeSlot || isLoading}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                    (date && selectedTimeSlot && !isLoading)
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <Check className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const fetchReservedTimes = async (setReservedTimes: React.Dispatch<React.SetStateAction<{ [date: string]: Set<string> }>>) => {
  try {
    const res = await api.get('users/appointments/reserved/');
    const map: { [date: string]: Set<string> } = {};
    res.data.reserved_dates.forEach((iso: string) => {
      const d = new Date(iso);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const timeStr = `${hours}:${minutes}`;
      if (!map[dateStr]) map[dateStr] = new Set();
      map[dateStr].add(timeStr);
    });
    setReservedTimes(map);
  } catch (e) {
    setReservedTimes({});
  }
};

export default BookingPage;
