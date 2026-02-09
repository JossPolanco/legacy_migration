import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notification, setNotification] = useState(null);
  
  const { token, user } = useAuth();
  const initialLoadDone = useRef(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

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
        const errorMsg = response.message || 'Error al cargar notificaciones';
        setError(errorMsg);
        showNotification(errorMsg, 'error');
      }
    } catch (error) {
      const errorMsg = 'Connection error loading notifications';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
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
        showNotification('All notifications marked as read', 'success');
      } else {
        showNotification(response.message || 'Error marking notifications as read', 'error');
      }
    } catch (error) {
      showNotification('Connection error marking notifications', 'error');
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
        showNotification('Notification marked as read', 'success');
      }
    } catch (error) {
      showNotification('Error marking notification as read', 'error');
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
    if (initialLoadDone.current || !user?.id) return;
    initialLoadDone.current = true;
    loadNotifications();
    loadUnreadCount();
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
    <div className="min-h-screen p-6 rounded-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-600">Stay updated with your task notifications</p>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 animate-in ${
            notification.type === 'success' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        {loading && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        )}

        {/* Notifications Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          {/* Card Header */}
          <div className="px-8 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  All Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 rounded-full px-3 py-1 text-sm font-semibold">
                      {unreadCount} New
                    </span>
                  )}
                </h2>
                {unreadCount === 0 && notifications.length > 0 && (
                  <p className="text-slate-300 text-sm mt-2">All notifications read</p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-screen overflow-y-auto">
            {loading ? (
              <div className="px-8 py-16 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-slate-600">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No notifications yet</h3>
                <p className="text-slate-600 text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-8 py-4 transition-all duration-150 border-l-4 ${
                      !notif.read
                        ? 'border-l-blue-600 bg-blue-50 hover:bg-blue-100'
                        : 'border-l-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Notification Header */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl flex-shrink-0">
                            {getNotificationIcon(notif.type)}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900 text-sm">
                                {notif.title}
                              </h3>
                              {!notif.read && (
                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {formatDate(notif.creationDate)}
                            </p>
                          </div>
                        </div>

                        {/* Notification Message */}
                        <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Task Reference */}
                        {notif.taskTitle && (
                          <div className="inline-block bg-slate-100 rounded-lg px-3 py-2 text-xs text-slate-700">
                            <span className="font-medium">Task:</span> {notif.taskTitle}
                          </div>
                        )}
                      </div>

                      {/* Mark Read Button */}
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          disabled={loading}
                          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50"
                        >
                          Mark Read
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
  );
};

export default NotificationManager;