import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { token } = useAuth();

  // API request helper
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
    if (token) {
      loadProjects();
    }
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
      } else {
        setError(response.message || 'Error al agregar proyecto');
      }
    } catch (error) {
      setError('Error al agregar proyecto');
      console.error('Error adding project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for updating project
  const handleSubmitUpdate = async () => {
    if (!selectedId) {
      setError('Selecciona un proyecto para actualizar');
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
      } else {
        setError(response.message || 'Error al actualizar proyecto');
      }
    } catch (error) {
      setError('Error al actualizar proyecto');
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion (soft delete)
  const handleDelete = async () => {
    if (!selectedId) {
      setError('Selecciona un proyecto para eliminar');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
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
        } else {
          setError(response.message || 'Error al eliminar proyecto');
        }
      } catch (error) {
        setError('Error al eliminar proyecto');
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
    return <div className="text-center py-10 text-gray-500 text-lg">Debe iniciar sesión para ver esta página</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl mb-4 text-slate-800">Gestión de Proyectos</h2>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700">Nombre</label>
        <input
          className="mt-1 w-full rounded border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nombre del proyecto"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700">Descripción</label>
        <textarea
          className="mt-1 w-full rounded border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Descripción del proyecto"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex gap-3 mb-8">
        <button
          className="rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50 transition duration-200"
          disabled={loading}
          onClick={handleSubmitAdd}
        >
          {loading ? 'Procesando...' : 'Agregar'}
        </button>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50 transition duration-200"
          disabled={loading || !selectedId}
          onClick={handleSubmitUpdate}
        >
          {loading ? 'Procesando...' : 'Actualizar'}
        </button>
        <button
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500 disabled:opacity-50 transition duration-200"
          disabled={loading || !selectedId}
          onClick={handleDelete}
        >
          {loading ? 'Procesando...' : 'Eliminar'}
        </button>
        <button
          className="rounded border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition duration-200"
          onClick={resetForm}
          disabled={loading}
        >
          Limpiar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Creado</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Activo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading && projects.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>
                  Cargando proyectos...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>
                  No hay proyectos aún.
                </td>
              </tr>
            ) : (
              projects.map(p => (
                <tr
                  key={p.id}
                  className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedId === p.id ? 'bg-slate-100 ring-2 ring-blue-200' : ''
                  }`}
                  onClick={() => onRowClick(p)}
                >
                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="max-w-xs truncate" title={p.description}>
                      {p.description || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{formatDate(p.creationDate)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      p.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {p.active ? 'Sí' : 'No'}
                    </span>
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

export default ProjectManager;