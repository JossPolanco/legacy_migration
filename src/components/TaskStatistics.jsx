import React from 'react';

const TaskStatistics = ({ statistics }) => {
  if (!statistics) return null;

  const stats = [
    {
      label: 'Total',
      value: statistics.total,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: statistics.completed,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Pending',
      value: statistics.pending,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      label: 'High Priority',
      value: statistics.highPriority,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      label: 'Overdue',
      value: statistics.overdue,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
        
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
            <div className={`h-2 ${stat.color} rounded-full mt-2 opacity-20`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatistics;