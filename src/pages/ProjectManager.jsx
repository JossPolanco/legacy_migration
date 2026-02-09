import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { token } = useAuth();
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

  // Load projects from API
  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/projects');
      if (response.success) {
        setProjects(response.data || []);
      } else {
        setError(response.message || 'Error al cargar proyectos');
      }
    } catch (error) {
      setError('Error al cargar proyectos');
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    if (initialLoadDone.current || !token) return;
    initialLoadDone.current = true;
    loadProjects();
  }, [token]);

  // Handle form submission for adding new project
  const handleSubmitAdd = async () => {
    if (!nombre.trim()) {
      setError('El nombre del proyecto es requerido');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: nombre.trim(),
          description: descripcion.trim()
        })
      });

      if (response.success) {
        await loadProjects();
        resetForm();
        setError('');
        setIsModalOpen(false);
        showNotification('Project created successfully', 'success');
      } else {
        showNotification(response.message || 'Error adding project', 'error');
      }
    } catch (error) {
      showNotification('Error adding project', 'error');
      console.error('Error adding project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for updating project
  const handleSubmitUpdate = async () => {
    if (!selectedId) {
      setError('Select a project to update');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre del proyecto es requerido');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiRequest('/projects', {
        method: 'PUT',
        body: JSON.stringify({
          id: selectedId,
          name: nombre.trim(),
          description: descripcion.trim()
        })
      });

      if (response.success) {
        await loadProjects();
        resetForm();
        setError('');
        setIsModalOpen(false);
        showNotification('Project updated successfully', 'success');
      } else {
        showNotification(response.message || 'Error updating project', 'error');
      }
    } catch (error) {
      showNotification('Error updating project', 'error');
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion (soft delete)
  const handleDelete = async () => {
    if (!selectedId) {
      setError('Select a project to delete');
      return;
    }

    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setLoading(true);
        setError('');
        
        const response = await apiRequest(`/projects/${selectedId}`, {
          method: 'DELETE'
        });

        if (response.success) {
          await loadProjects();
          resetForm();
          setError('');
          setIsModalOpen(false);
          showNotification('Project deleted successfully', 'success');
        } else {
          showNotification(response.message || 'Error deleting project', 'error');
        }
      } catch (error) {
        showNotification('Error deleting project', 'error');
        console.error('Error deleting project:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setSelectedId(null);
    setError('');
  };

  // Handle row click to populate form
  const onRowClick = (project) => {
    setSelectedId(project.id);
    setNombre(project.name);
    setDescripcion(project.description || '');
    setError('');
    setIsModalOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('es-ES');
    } catch {
      return '-';
    }
  };

  if (!token) {
    return <div className="text-center py-10 text-gray-500 text-lg">You must log in to view this page</div>;
  }

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Project Management</h1>
            <p className="text-slate-600">Create, edit, and manage your projects</p>
          </div>
          <button
            onClick={() => {
              setSelectedId(null);
              setNombre('');
              setDescripcion('');
              setError('');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
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
        {loading && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedId ? '✏️ Edit Project' : '➕ Create New Project'}
                </h2>
                <button
                  onClick={() => {
                    setSelectedId(null);
                    setNombre('');
                    setDescripcion('');
                    setError('');
                    setIsModalOpen(false);
                  }}
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
                {error && (
                  <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-900 mb-2">Project Name *</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter project name"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={4}
                    placeholder="Enter project description"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50 transition duration-200 font-medium"
                    disabled={loading}
                    onClick={selectedId ? handleSubmitUpdate : handleSubmitAdd}
                  >
                    {loading ? 'Processing...' : (selectedId ? 'Update Project' : 'Create Project')}
                  </button>
                  {selectedId && (
                    <button
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50 transition duration-200 font-medium"
                      disabled={loading}
                      onClick={handleDelete}
                    >
                      {loading ? 'Processing...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Table Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          {/* Table Header */}
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-900">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              All Projects
              <span className="ml-auto bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold">
                {projects.length}
              </span>
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">ID</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">Name</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">Description</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">Created</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No projects yet</h3>
                        <p className="text-slate-600 text-sm">Click "New Project" to create your first project</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects
                    .sort((a, b) => b.id - a.id)
                    .map(p => (
                    <tr
                      key={p.id}
                      onClick={() => onRowClick(p)}
                      className={`cursor-pointer transition-all duration-150 border-l-4 ${
                        selectedId === p.id
                          ? 'border-l-blue-600 bg-blue-50'
                          : 'border-l-transparent hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-slate-900">#{p.id}</td>
                      <td className="px-8 py-4 text-sm text-slate-900 font-medium max-w-sm truncate">{p.name}</td>
                      <td className="px-8 py-4 text-sm text-slate-600 max-w-md truncate" title={p.description}>
                        {p.description || <span className="text-slate-400 italic">No description</span>}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-600">{formatDate(p.creationDate)}</td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          p.active
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}>
                          {p.active ? '✓ Active' : '✕ Inactive'}
                        </span>
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

export default ProjectManager;