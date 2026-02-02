import React from 'react';

export const useHistoryLogger = (token) => {
  const logHistoryEvent = async (taskId, action, description) => {
    try {
      // Asegurar que taskId es un número
      const numTaskId = parseInt(taskId, 10);
      
      if (isNaN(numTaskId)) {
        console.error('Invalid taskId:', taskId);
        return;
      }

      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: numTaskId,
          action,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error logging history:', response.status, data);
        return;
      }

      console.log('History event logged successfully:', data);
    } catch (error) {
      console.error('Error logging history:', error);
    }
  };

  return { logHistoryEvent };
};

export default useHistoryLogger;
