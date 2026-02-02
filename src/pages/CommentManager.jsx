import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useHistoryLogger from '../hooks/useHistoryLogger';

const CommentManager = () => {
  const [taskId, setTaskId] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  
  const { token } = useAuth();
  const { logHistoryEvent } = useHistoryLogger(token);

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

  // Load comments by task ID
  const loadCommentsByTask = async () => {
    if (!taskId.trim()) {
      setError('El ID de la tarea es requerido');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setShowAllComments(false);
      
      const response = await apiRequest(`/comments/task/${taskId.trim()}`);
      if (response.success) {
        setComments(response.data || []);
        setError('');
      } else {
        setError(response.message || 'Error al cargar comentarios');
        setComments([]);
      }
    } catch (error) {
      setError('Error al cargar comentarios de la tarea');
      setComments([]);
      console.error('Error loading task comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load all comments
  const loadAllComments = async () => {
    try {
      setLoading(true);
      setError('');
      setShowAllComments(true);
      
      const response = await apiRequest('/comments/all');
      if (response.success) {
        setComments(response.data || []);
        setError('');
      } else {
        setError(response.message || 'Error al cargar todos los comentarios');
        setComments([]);
      }
    } catch (error) {
      setError('Error al cargar todos los comentarios');
      setComments([]);
      console.error('Error loading all comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new comment
  const handleSubmitComment = async () => {
    if (!taskId.trim()) {
      setError('El ID de la tarea es requerido');
      return;
    }

    if (!comment.trim()) {
      setError('El comentario es requerido');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiRequest('/comments', {
        method: 'POST',
        body: JSON.stringify({
          taskId: parseInt(taskId.trim(), 10),
          comment: comment.trim()
        })
      });

      if (response.success) {
        await logHistoryEvent(
          parseInt(taskId.trim(), 10),
          'COMMENTED',
          `Comentario agregado: "${comment.trim().substring(0, 100)}${comment.trim().length > 100 ? '...' : ''}"`
        );
        setComment('');
        setError('');
        // Reload comments for the current task
        if (!showAllComments) {
          await loadCommentsByTask();
        } else {
          await loadAllComments();
        }
      } else {
        setError(response.message || 'Error al agregar comentario');
      }
    } catch (error) {
      setError('Error al agregar comentario');
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
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
      <h2 className="text-2xl mb-4 text-slate-800">Comentarios de Tareas</h2>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-red-700">
          {error}
        </div>
      )}

      {/* Form Section */}
      <div className="mb-6 border-b border-gray-200 pb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">ID Tarea</label>
          <input
            type="number"
            className="w-full rounded border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingrese el ID de la tarea"
            value={taskId}
            onChange={e => setTaskId(e.target.value)}
            disabled={loading}
            min="1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Comentario</label>
          <textarea
            className="w-full rounded border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Ingrese su comentario"
            value={comment}
            onChange={e => setComment(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50 transition duration-200"
            disabled={loading}
            onClick={handleSubmitComment}
          >
            {loading ? 'Agregando...' : 'Agregar Comentario'}
          </button>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50 transition duration-200"
            disabled={loading}
            onClick={loadCommentsByTask}
          >
            {loading ? 'Cargando...' : 'Cargar Comentarios'}
          </button>
          <button
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500 disabled:opacity-50 transition duration-200"
            disabled={loading}
            onClick={loadAllComments}
          >
            {loading ? 'Cargando...' : 'Cargar Todos los Comentarios'}
          </button>
        </div>
      </div>

      {/* Comments Display Section */}
      <div className="mb-4">
        <h3 className="text-lg mb-4 text-slate-700 border-b-2 border-gray-200 pb-2">
          {showAllComments ? 'Todos los Comentarios' : `Comentarios${taskId ? ` - Tarea ${taskId}` : ''}`}
          {comments.length > 0 && (
            <span className="text-sm text-gray-500 ml-2">({comments.length} comentarios)</span>
          )}
        </h3>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px] max-h-[600px] overflow-y-auto">
          {loading && comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Cargando comentarios...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {showAllComments 
                ? 'No hay comentarios en el sistema.' 
                : taskId 
                  ? `No hay comentarios para la tarea ${taskId}.` 
                  : 'Ingrese un ID de tarea y haga clic en "Cargar Comentarios".'
              }
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((commentItem, index) => (
                <div key={commentItem.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">
                        {commentItem.userCreateName}
                      </span>
                      {showAllComments && (
                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Tarea #{commentItem.taskId}: {commentItem.taskTitle}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(commentItem.creationDate)}
                    </span>
                  </div>
                  <div className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                    {commentItem.comment}
                  </div>
                  {commentItem.modificationDate && (
                    <div className="text-xs text-gray-400 mt-2">
                      Modificado: {formatDate(commentItem.modificationDate)}
                      {commentItem.userModName && ` por ${commentItem.userModName}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentManager;