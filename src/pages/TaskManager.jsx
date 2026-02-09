import React, { useState, useEffect, useRef, useCallback } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskStatistics from '../components/TaskStatistics';
import { useAuth } from '../context/AuthContext';
import useHistoryLogger from '../hooks/useHistoryLogger';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [states, setStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { token } = useAuth();
  const { logHistoryEvent } = useHistoryLogger(token);
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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (initialLoadDone.current || !token) return;
      
      try {
        setLoading(true);
        initialLoadDone.current = true;
        
        await Promise.all([
          loadTasks(),
          loadProjects(),
          loadUsers(),
          loadStates(),
          loadPriorities(),
          loadStatistics()
        ]);
      } catch (error) {
        setError('Error loading initial data');
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [token]);

  const loadTasks = async () => {
    try {
      const response = await apiRequest('/tasks');
      if (response.success) {
        setTasks(response.data || []);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await apiRequest('/tasks/projects');
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiRequest('/tasks/users');
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadStates = async () => {
    try {
      const response = await apiRequest('/tasks/states');
      if (response.success) {
        setStates(response.data || []);
      }
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadPriorities = async () => {
    try {
      const response = await apiRequest('/tasks/priorities');
      if (response.success) {
        setPriorities(response.data || []);
      }
    } catch (error) {
      console.error('Error loading priorities:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await apiRequest('/tasks/statistics');
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleTaskCreate = async (taskData) => {
    setActionLoading(true);
    try {
      const response = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });

      if (response.success) {
        // Registrar evento de historial
        const newTaskId = response.data?.id;
        console.log('Nueva tarea creada con ID:', newTaskId);
        
        if (newTaskId) {
          await logHistoryEvent(
            newTaskId,
            'CREATED',
            `Task created: "${taskData.title}"`
          );
        }
        
        // Recargar datos
        await loadTasks();
        await loadStatistics();
        setSelectedTask(null);
        setIsModalOpen(false);
        showNotification('Task created successfully', 'success');
      } else {
        showNotification(response.message || 'Error al crear la tarea', 'error');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showNotification('Error al crear la tarea', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTaskUpdate = async (taskData) => {
    setActionLoading(true);
    try {
      const oldTask = tasks.find(t => t.id === taskData.id);
      const changes = [];

      if (oldTask && oldTask.title !== taskData.title) {
        changes.push(`Title: "${oldTask.title}" → "${taskData.title}"`);
      }
      if (oldTask && oldTask.description !== taskData.description) {
        changes.push(`Description modified`);
      }
      if (oldTask && oldTask.stateId !== taskData.stateId) {
        const oldState = states.find(s => s.id === oldTask.stateId)?.name || 'unknown';
        const newState = states.find(s => s.id === taskData.stateId)?.name || 'unknown';
        changes.push(`State: "${oldState}" → "${newState}"`);
      }
      if (oldTask && oldTask.priorityId !== taskData.priorityId) {
        const oldPriority = priorities.find(p => p.id === oldTask.priorityId)?.name || 'unknown';
        const newPriority = priorities.find(p => p.id === taskData.priorityId)?.name || 'unknown';
        changes.push(`Priority: "${oldPriority}" → "${newPriority}"`);
      }
      if (oldTask && oldTask.asignedId !== taskData.asignedId) {
        const oldUser = users.find(u => u.id === oldTask.asignedId)?.username || 'unassigned';
        const newUser = users.find(u => u.id === taskData.asignedId)?.username || 'unassigned';
        changes.push(`Assigned to: "${oldUser}" → "${newUser}"`);
      }

      const response = await apiRequest('/tasks', {
        method: 'PUT',
        body: JSON.stringify(taskData)
      });

      if (response.success) {
        // Registrar evento de historial PRIMERO
        if (changes.length > 0) {
          console.log('Registrando evento de historial para tarea', taskData.id);
          await logHistoryEvent(
            taskData.id,
            'UPDATED',
            `Changes made:\n${changes.join('\n')}`
          );
        }
        
        // Luego recargar datos
        await loadTasks();
        await loadStatistics();
        setSelectedTask(null);
        setIsModalOpen(false);
        showNotification('Task updated successfully', 'success');
      } else {
        showNotification(response.message || 'Error al actualizar la tarea', 'error');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      showNotification('Error al actualizar la tarea', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setActionLoading(true);
      try {
        const taskToDelete = tasks.find(t => t.id === taskId);
        const response = await apiRequest(`/tasks/${taskId}`, {
          method: 'DELETE'
        });

        if (response.success) {
          // Registrar evento de historial ANTES de recargar
          if (taskToDelete) {
            await logHistoryEvent(
              taskId,
              'DELETED',
              `Task deleted: "${taskToDelete.title}"`
            );
          }
          
          await loadTasks();
          await loadStatistics();
          setSelectedTask(null);
          setIsModalOpen(false);
          showNotification('Task deleted successfully', 'success');
        } else {
          showNotification(response.message || 'Error al eliminar la tarea', 'error');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error al eliminar la tarea', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleClear = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  if (!token) {
    return <div className="text-center py-10 text-gray-500 text-lg">You must log in to view this page</div>;
  }

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 text-lg">{error}</div>;
  }

  const getPriorityColor = (priorityId) => {
    const priority = priorities.find(p => p.id === priorityId);
    if (!priority) return 'bg-red-50 text-red-700 border-red-200';
    
    const nameUpper = priority.name?.toUpperCase() || '';
    if (nameUpper.includes('HIGH') || nameUpper.includes('ALTO')) return 'bg-red-50 text-red-700 border-red-200';
    if (nameUpper.includes('MEDIUM') || nameUpper.includes('MEDIO')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (nameUpper.includes('LOW') || nameUpper.includes('BAJO')) return 'bg-green-50 text-green-700 border-green-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStateColor = (stateId) => {
    const state = states.find(s => s.id === stateId);
    if (!state) return 'bg-gray-50 hover:bg-gray-100';
    
    const nameUpper = state.name?.toUpperCase() || '';
    if (nameUpper.includes('PENDING') || nameUpper.includes('PENDIENTE')) return 'bg-orange-50 hover:bg-orange-100';
    if (nameUpper.includes('IN PROGRESS') || nameUpper.includes('EN PROGRESO')) return 'bg-blue-50 hover:bg-blue-100';
    if (nameUpper.includes('COMPLETED') || nameUpper.includes('COMPLETADO')) return 'bg-green-50 hover:bg-green-100';
    if (nameUpper.includes('CLOSED') || nameUpper.includes('CERRADO')) return 'bg-slate-50 hover:bg-slate-100';
    return 'bg-gray-50 hover:bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Task Management</h1>
            <p className="text-slate-600">Create, edit, and manage your project tasks</p>
          </div>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* Notificación Toast */}
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

        {/* Barra de progreso superior */}
        {actionLoading && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20  z-40 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedTask ? '✏️ Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={handleClear}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6 max-h-96 overflow-y-auto">
                <TaskForm
                  task={selectedTask}
                  projects={projects}
                  users={users}
                  states={states}
                  priorities={priorities}
                  onSubmit={selectedTask ? handleTaskUpdate : handleTaskCreate}
                  onDelete={selectedTask?.id ? () => handleTaskDelete(selectedTask.id) : undefined}
                  onClear={handleClear}
                  disabled={actionLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        {statistics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Statistics</h2>
            <TaskStatistics statistics={statistics} />
          </div>
        )}

        {/* Tasks Table Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          {/* Table Header */}
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-900">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              All Tasks
              <span className="ml-auto bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold">
                {tasks.length}
              </span>
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Assigned To
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No tasks yet</h3>
                        <p className="text-slate-600 text-sm">Click "New Task" to create your first task</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tasks
                    .sort((a, b) => b.id - a.id)
                    .map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => handleTaskSelect(task)}
                      className={`cursor-pointer transition-all duration-150 border-l-4 ${
                        selectedTask?.id === task.id
                          ? 'border-l-blue-600 bg-blue-50'
                          : 'border-l-transparent ' + getStateColor(task.stateId)
                      }`}
                    >
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        #{task.id}
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-900 font-medium max-w-sm truncate">
                        {task.title}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-600">
                        {task.projectName || <span className="text-slate-400 italic">Unassigned</span>}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          task.stateId === 1 ? 'bg-orange-100 text-orange-800 border-orange-300' :
                          task.stateId === 2 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          task.stateId === 3 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          'bg-slate-100 text-slate-800 border-slate-300'
                        }`}>
                          {task.stateName}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priorityId)}`}>
                          {task.priorityName}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          {users.find(u => u.id === task.asignedId) ? (
                            <>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                {users.find(u => u.id === task.asignedId)?.username?.charAt(0).toUpperCase()}
                              </div>
                              <span>{users.find(u => u.id === task.asignedId)?.username}</span>
                            </>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;