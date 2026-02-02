import React from 'react';

const TaskList = ({ tasks, onTaskSelect, selectedTaskId }) => {
  const getStateStyle = (stateId) => {
    switch (stateId) {
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityStyle = (priorityId) => {
    switch (priorityId) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-orange-100 text-orange-800';
      case 4:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isOverdue = (dateString, stateId) => {
    const today = new Date();
    const expirationDate = new Date(dateString);
    return expirationDate < today && stateId !== 3;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proyecto
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asignado
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vencimiento
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No hay tareas disponibles
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr
                key={task.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedTaskId === task.id ? 'bg-blue-50' : ''
                } ${isOverdue(task.expirationDate, task.stateId) ? 'border-l-4 border-red-500' : ''}`}
                onClick={() => onTaskSelect(task)}
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  {task.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-gray-500 text-xs truncate max-w-xs">
                        {task.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStateStyle(task.stateId)}`}>
                    {task.stateName}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityStyle(task.priorityId)}`}>
                    {task.priorityName}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {task.projectName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {task.asignedName || 'Sin asignar'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className={isOverdue(task.expirationDate, task.stateId) ? 'text-red-600 font-medium' : ''}>
                    {formatDate(task.expirationDate)}
                    {isOverdue(task.expirationDate, task.stateId) && (
                      <div className="text-xs text-red-500">Vencida</div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;