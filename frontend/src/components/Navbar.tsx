import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart, Menu, X, LogIn, Crown, User, Bell, Shield,
  CheckCheck, Info, AlertCircle, Calendar, Activity,
} from 'lucide-react';
import api from '../utils/api/api';

interface Notification {
  id: number;
  notification_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  user: number;
}

const getNotificationIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'appointment': return <Calendar className="h-4 w-4 text-blue-500" />;
    case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'health': return <Activity className="h-4 w-4 text-green-500" />;
    default: return <Info className="h-4 w-4 text-gray-400" />;
  }
};

const formatTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [signtext, setSigntext] = useState('Sign in');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token')) {
      setLoggedin(true);
      setSigntext('Log out');
    }

    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsPremium(parsedUser.premium_status || false);
      setIsAdmin(parsedUser.role === 'admin');
    }

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    const fetchNotifications = async () => {
      try {
        const response = await api.get<{ notifications: Notification[] }>('users/notifications/');
        const notifs = response.data.notifications || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.is_read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (loggedin) fetchNotifications();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loggedin]);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      console.log('mousedown e.target:', e.target);
      if (notificationRef.current) {
        const contains = notificationRef.current.contains(e.target as Node);
        console.log('notificationRef contains target:', contains);
        if (!contains) {
          console.log('Outside click detected, closing popup');
          setIsNotificationOpen(false);
        }
      } else {
        console.log('notificationRef.current is null');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotificationMenu = () => {
    console.log('toggleNotificationMenu clicked, current state:', isNotificationOpen);
    setIsNotificationOpen((prev) => !prev);
  };

  const markAllRead = async () => {
    try {
      await api.post('users/notifications/mark-all-read/');
    } catch { /* ignore */ }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id: number) => {
    try {
      await api.post(`users/notifications/${id}/mark-read/`);
    } catch { /* ignore */ }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleAvatarClick = () => {
    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      navigate(parsedUser.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleSignButton = () => {
    const hasToken = sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token');
    if (hasToken) {
      sessionStorage.clear();
      localStorage.clear();
      navigate('/');
      window.location.reload();
    } else {
      navigate('/login');
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'
        } mb-6`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* ── Left: Logo + Nav links ── */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <Heart className={`h-8 w-8 text-blue-600 transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`} />
              </Link>
              <Link to="/" className="ml-2 text-xl font-bold text-gray-800">HealthTrust</Link>
            </div>
            {location.pathname === '/' && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <button onClick={() => navigate('/')} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-blue-500 transition-colors duration-200">Home</button>
                <button onClick={() => scrollToSection('services')} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent transition-colors duration-200">Services</button>
                <button onClick={() => scrollToSection('wellness')} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent transition-colors duration-200">About</button>
                <button onClick={() => scrollToSection('contact')} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent transition-colors duration-200">Contact</button>
              </div>
            )}
          </div>

          {/* ── Right: Actions ── */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={handleSignButton} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200">
              <LogIn className="mr-2 h-4 w-4" />{signtext}
            </button>

            {!isAdmin && !isPremium && (
              <Link
                to="/premium"
                onClick={(e) => { if (!sessionStorage.getItem('userData')) { e.preventDefault(); navigate('/login'); } }}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
              >
                <Crown className="mr-2 h-4 w-4" />Upgrade to Premium
              </Link>
            )}

            {!isAdmin && (
              <Link
                to="/book-appointment"
                onClick={(e) => { if (!sessionStorage.getItem('userData')) { e.preventDefault(); navigate('/login'); } }}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Book Appointment
              </Link>
            )}

            {/* ── Notification Bell + Facebook-style popup ── */}
            {loggedin && (
              <div className="relative" ref={notificationRef}>
                {/* Bell button */}
                <button
                  id="notification-bell-btn"
                  onClick={toggleNotificationMenu}
                  className="relative h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 focus:outline-none"
                >
                  <Bell className="h-5 w-5 text-blue-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Popup */}
                {isNotificationOpen && (
                  <div
                    id="notification-popup"
                    className="fixed top-[72px] right-4 md:right-8 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <h3 className="text-base font-bold text-gray-900">Notifications</h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* List */}
                    <ul className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <li
                            key={n.id}
                            onClick={() => !n.is_read && markOneRead(n.id)}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${n.is_read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                              }`}
                          >
                            {/* Icon bubble */}
                            <div className={`mt-0.5 flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${n.is_read ? 'bg-gray-100' : 'bg-blue-100'
                              }`}>
                              {getNotificationIcon(n.notification_type)}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-snug ${n.is_read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                {n.message}
                              </p>
                              <p className="text-xs text-blue-500 mt-0.5 font-medium">
                                {formatTime(n.created_at)}
                              </p>
                            </div>

                            {/* Unread dot */}
                            {!n.is_read && (
                              <span className="mt-2 flex-shrink-0 h-2.5 w-2.5 rounded-full bg-blue-500" />
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="flex flex-col items-center justify-center py-12 text-center px-4">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <Bell className="h-6 w-6 text-gray-300" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
                          <p className="text-xs text-gray-400 mt-1">No new notifications</p>
                        </li>
                      )}
                    </ul>

                    {/* Footer — "See all" link */}
                    {notifications.length > 0 && (
                      <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
                        <button
                          onClick={() => { setIsNotificationOpen(false); navigate('/NotificationPage'); }}
                          className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          See all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Avatar / Profile button */}
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 focus:outline-none"
              >
                {isAdmin ? <Shield className="h-6 w-6 text-blue-600" /> : <User className="h-6 w-6 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* ── Mobile hamburger ── */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;