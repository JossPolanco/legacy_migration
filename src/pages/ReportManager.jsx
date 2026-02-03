import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ReportManager = () => {
  const [reportType, setReportType] = useState('tasks');
  const [taskReport, setTaskReport] = useState([]);
  const [projectReport, setProjectReport] = useState([]);
  const [userReport, setUserReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { token } = useAuth();

  useEffect(() => {
    loadAllReports();
  }, []);

  const apiRequest = async (url) => {
    const response = await fetch(`/api${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  };

  const loadAllReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        apiRequest('/tasks/report/by-state'),
        apiRequest('/tasks/report/by-project'),
        apiRequest('/tasks/report/by-user')
      ]);

      if (tasksRes.success) setTaskReport(tasksRes.data);
      if (projectsRes.success) setProjectReport(projectsRes.data);
      if (usersRes.success) setUserReport(usersRes.data);
    } catch (err) {
      setError('Error loading reports: ' + err.message);
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Task Report by State
    csvContent += 'REPORT: TASKS\n';
    taskReport.forEach(item => {
      csvContent += `${item.name}: ${item.count} tasks\n`;
    });
    
    csvContent += '\nREPORT: PROJECTS\n';
    projectReport.forEach(item => {
      csvContent += `${item.name}: ${item.count} tasks\n`;
    });
    
    csvContent += '\nREPORT: USERS\n';
    userReport.forEach(item => {
      csvContent += `${item.name}: ${item.count} assigned tasks\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Report Generation</h2>
        </div>

        <div className="p-6">
          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setReportType('tasks')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                reportType === 'tasks'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tasks Report
            </button>
            <button
              onClick={() => setReportType('projects')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                reportType === 'projects'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Projects Report
            </button>
            <button
              onClick={() => setReportType('users')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                reportType === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Users Report
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Export to CSV
            </button>
          </div>

          {/* Área de contenido del reporte */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading reports...</div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 font-mono whitespace-pre-wrap">
              {reportType === 'tasks' && (
                <div>
                  <div className="text-gray-700 font-bold mb-3">REPORT: TASKS</div>
                  {taskReport.length === 0 ? (
                    <div className="text-gray-500">No hay datos disponibles</div>
                  ) : (
                    taskReport.map((item, index) => (
                      <div key={index} className="text-gray-700">
                        {item.name}: {item.count} tareas
                      </div>
                    ))
                  )}
                </div>
              )}

              {reportType === 'projects' && (
                <div>
                  <div className="text-gray-700 font-bold mb-3">REPORT: PROJECTS</div>
                  {projectReport.length === 0 ? (
                    <div className="text-gray-500">No hay datos disponibles</div>
                  ) : (
                    projectReport.map((item, index) => (
                      <div key={index} className="text-gray-700">
                        {item.name}: {item.count} tasks
                      </div>
                    ))
                  )}
                </div>
              )}

              {reportType === 'users' && (
                <div>
                  <div className="text-gray-700 font-bold mb-3">REPORT: USERS</div>
                  {userReport.length === 0 ? (
                    <div className="text-gray-500">No hay datos disponibles</div>
                  ) : (
                    userReport.map((item, index) => (
                      <div key={index} className="text-gray-700">
                        {item.name}: {item.count} assigned tasks
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportManager;
