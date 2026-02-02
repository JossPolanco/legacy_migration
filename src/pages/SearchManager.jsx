import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SearchManager = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  const [states, setStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    loadFilters();
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

  const loadFilters = async () => {
    try {
      const [statesRes, prioritiesRes, projectsRes] = await Promise.all([
        apiRequest('/tasks/states'),
        apiRequest('/tasks/priorities'),
        apiRequest('/tasks/projects')
      ]);

      if (statesRes.success) setStates(statesRes.data);
      if (prioritiesRes.success) setPriorities(prioritiesRes.data);
      if (projectsRes.success) setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/tasks');
      
      if (response.success) {
        let filteredTasks = response.data;

        // Filtrar por texto
        if (searchText.trim()) {
          const searchLower = searchText.toLowerCase();
          filteredTasks = filteredTasks.filter(task =>
            task.title?.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower)
          );
        }

        // Filtrar por estado
        if (selectedState) {
          filteredTasks = filteredTasks.filter(task => task.stateId === parseInt(selectedState));
        }

        // Filtrar por prioridad
        if (selectedPriority) {
          filteredTasks = filteredTasks.filter(task => task.priorityId === parseInt(selectedPriority));
        }

        // Filtrar por proyecto
        if (selectedProject) {
          filteredTasks = filteredTasks.filter(task => task.projectId === parseInt(selectedProject));
        }

        setTasks(filteredTasks);
      }
    } catch (error) {
      console.error('Error searching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Búsqueda Avanzada</h2>

      {/* Formulario de búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto:
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar en título o descripción..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado:
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad:
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proyecto:
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyecto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  {loading ? 'Buscando...' : 'No se encontraron tareas. Usa los filtros y presiona "Buscar".'}
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.stateName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.priorityName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.projectName}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchManager;
