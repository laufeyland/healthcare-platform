import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api/api';
import { Bell, Info, CheckCircle } from 'lucide-react';

interface Notification {
  id: number;
  notification_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('users/notifications/');
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to fetch notifications.');

      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  function formatMessageWithDate(message: string) {

    const isoDateRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\+\d{2}:\d{2}|Z)?/;
    const match = message.match(isoDateRegex);
    if (match) {

      const isoString = match[0].replace(' ', 'T');
      const dateObj = new Date(isoString);
      const formatted = dateObj.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return message.replace(match[0], formatted);
    }
    return message;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 select-none" aria-hidden>
        <Bell className="w-64 h-64 text-blue-200 mx-auto mt-24" />
      </div>
      <div className="h-16"></div>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-7 h-7 text-blue-500" />
          Notifications
        </h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 rounded-xl border flex items-start gap-4 shadow-sm ${
                    notification.is_read ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="pt-1">
                    {notification.notification_type === 'info' ? (
                      <Info className="w-6 h-6 text-blue-400" />
                    ) : notification.notification_type === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Bell className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                      {notification.notification_type.charAt(0).toUpperCase() + notification.notification_type.slice(1)}
                    </h2>
                    <p className="text-sm text-gray-700 mb-2">
                      {formatMessageWithDate(notification.message)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Bell className="w-16 h-16 text-blue-200 mb-4" />
                <p className="text-lg text-gray-400 font-medium">No notifications available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
