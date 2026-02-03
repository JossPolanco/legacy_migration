import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { token, user } = useAuth();

  const apiRequest = async (url, options = {}) => {
    try {
      const response = await fetch(`/api${url}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  };

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(`/notifications/user/${user.id}`);
      
      if (response.success) {
        setNotifications(response.data || []);
      } else {
        setError(response.message || 'Error al cargar notificaciones');
      }
    } catch (error) {
      setError('Connection error loading notifications');
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      const response = await apiRequest(`/notifications/mark-all-read/${user.id}`, {
        method: 'PUT'
      });
      
      if (response.success) {
        // Update local notifications state
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            read: true
          }))
        );
        setUnreadCount(0);
      } else {
        setError(response.message || 'Error marking notifications as read');
      }
    } catch (error) {
      setError('Connection error marking notifications');
      console.error('Error marking notifications as read:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await apiRequest(`/notifications/mark-read/${notificationId}`, {
        method: 'PUT'
      });
      
      if (response.success) {
        // Update local notification state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const loadUnreadCount = async () => {
    if (!user?.id) return;
    
    try {
      const response = await apiRequest(`/notifications/user/${user.id}/unread-count`);
      
      if (response.success) {
        setUnreadCount(response.data || 0);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadUnreadCount();
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_created':
        return '📋';
      case 'task_updated':
        return '✏️';
      case 'task_assigned':
        return '👤';
      case 'task_completed':
        return '✅';
      default:
        return '📢';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
              {unreadCount} unread
            </span>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Notifications'}
            </button>
            
            <button
              onClick={markAllAsRead}
              disabled={loading || notifications.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Read
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          <div className="border rounded-md">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-sm font-medium text-gray-700">NOTIFICATIONS</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No notifications to display.</p>
                  <p className="text-sm mt-2">Click "Load Notifications" to get the latest updates.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <span className="font-medium text-gray-900">{notification.title}</span>
                            {!notification.read && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Task: {notification.taskTitle}</span>
                            <span>•</span>
                            <span>{formatDate(notification.creationDate)}</span>
                          </div>
                        </div>
                        
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="ml-4 text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;