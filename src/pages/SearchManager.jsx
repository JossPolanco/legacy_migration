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
  const [hasSearched, setHasSearched] = useState(false);
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
    setHasSearched(true);
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Advanced Search</h1>
          <p className="text-slate-600">Find tasks using filters and search criteria</p>
        </div>

        {/* Barra de progreso */}
        {loading && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        )}

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Search Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Search Text
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search in title or description..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority.id} value={priority.id}>
                    {priority.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Projects</option>
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Tabla de resultados */}
        {hasSearched && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
            {/* Table Header */}
            <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-900">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Search Results
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
                      State
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Project
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">No tasks found</h3>
                          <p className="text-slate-600 text-sm">Try adjusting your search filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr
                        key={task.id}
                        className={`transition-all duration-150 border-l-4 border-l-transparent ${getStateColor(task.stateId)}`}
                      >
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                          #{task.id}
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-900 font-medium max-w-sm truncate">
                          {task.title}
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
                          {task.projectName || <span className="text-slate-400 italic">Unassigned</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchManager;
