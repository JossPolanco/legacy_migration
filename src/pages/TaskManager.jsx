import React, { useState, useEffect } from 'react';
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
  
  const { token } = useAuth();
  const { logHistoryEvent } = useHistoryLogger(token);

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
      try {
        setLoading(true);
        await Promise.all([
          loadTasks(),
          loadProjects(),
          loadUsers(),
          loadStates(),
          loadPriorities(),
          loadStatistics()
        ]);
      } catch (error) {
        setError('Error al cargar los datos iniciales');
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadInitialData();
    }
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
            `Tarea creada: "${taskData.title}"`
          );
        }
        
        // Recargar datos
        await loadTasks();
        await loadStatistics();
        setSelectedTask(null);
        alert('Tarea creada exitosamente');
      } else {
        alert(response.message || 'Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error al crear la tarea');
    }
  };

  const handleTaskUpdate = async (taskData) => {
    try {
      const oldTask = tasks.find(t => t.id === taskData.id);
      const changes = [];

      if (oldTask && oldTask.title !== taskData.title) {
        changes.push(`Título: "${oldTask.title}" → "${taskData.title}"`);
      }
      if (oldTask && oldTask.description !== taskData.description) {
        changes.push(`Descripción modificada`);
      }
      if (oldTask && oldTask.stateId !== taskData.stateId) {
        const oldState = states.find(s => s.id === oldTask.stateId)?.name || 'desconocido';
        const newState = states.find(s => s.id === taskData.stateId)?.name || 'desconocido';
        changes.push(`Estado: "${oldState}" → "${newState}"`);
      }
      if (oldTask && oldTask.priorityId !== taskData.priorityId) {
        const oldPriority = priorities.find(p => p.id === oldTask.priorityId)?.name || 'desconocida';
        const newPriority = priorities.find(p => p.id === taskData.priorityId)?.name || 'desconocida';
        changes.push(`Prioridad: "${oldPriority}" → "${newPriority}"`);
      }
      if (oldTask && oldTask.asignedId !== taskData.asignedId) {
        const oldUser = users.find(u => u.id === oldTask.asignedId)?.username || 'sin asignar';
        const newUser = users.find(u => u.id === taskData.asignedId)?.username || 'sin asignar';
        changes.push(`Asignado a: "${oldUser}" → "${newUser}"`);
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
            `Cambios realizados:\n${changes.join('\n')}`
          );
        }
        
        // Luego recargar datos
        await loadTasks();
        await loadStatistics();
        setSelectedTask(null);
        alert('Tarea actualizada exitosamente');
      } else {
        alert(response.message || 'Error al actualizar la tarea');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error al actualizar la tarea');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tarea?')) {
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
              `Tarea eliminada: "${taskToDelete.title}"`
            );
          }
          
          await loadTasks();
          await loadStatistics();
          setSelectedTask(null);
          alert('Tarea eliminada exitosamente');
        } else {
          alert(response.message || 'Error al eliminar la tarea');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error al eliminar la tarea');
      }
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleClear = () => {
    setSelectedTask(null);
  };

  if (!token) {
    return <div className="text-center py-10 text-gray-500 text-lg">Debe iniciar sesión para ver esta página</div>;
  }

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl mb-6 text-slate-800">Gestión de Tareas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 mb-6">
        <div>
          <h3 className="text-lg mb-4 text-slate-700 border-b-2 border-gray-200 pb-2">Nueva/Editar Tarea</h3>
          <TaskForm
            task={selectedTask}
            projects={projects}
            users={users}
            states={states}
            priorities={priorities}
            onSubmit={selectedTask ? handleTaskUpdate : handleTaskCreate}
            onDelete={selectedTask?.id ? () => handleTaskDelete(selectedTask.id) : undefined}
            onClear={handleClear}
          />
        </div>

        <div>
          <h3 className="text-lg mb-4 text-slate-700 border-b-2 border-gray-200 pb-2">Lista de Tareas</h3>
          <TaskList tasks={tasks} onTaskSelect={handleTaskSelect} selectedTaskId={selectedTask?.id} />
        </div>
      </div>

      {statistics && <TaskStatistics statistics={statistics} />}
    </div>
  );
};

export default TaskManager;