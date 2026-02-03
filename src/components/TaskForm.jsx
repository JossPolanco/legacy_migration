import React from 'react';

const TaskForm = ({ task, projects, users, states, priorities, onSubmit, onDelete, onClear, disabled }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    stateId: 1,
    priorityId: 2,
    projectId: 1,
    asignedId: 0,
    expirationDate: '',
    estimatedHours: 0
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        stateId: task.stateId || (states.length > 0 ? states[0].id : 1),
        priorityId: task.priorityId || (priorities.length > 0 ? priorities[0].id : 1),
        projectId: task.projectId || (projects.length > 0 ? projects[0].id : 1),
        asignedId: task.asignedId || 0,
        expirationDate: task.expirationDate ? new Date(task.expirationDate).toISOString().split('T')[0] : '',
        estimatedHours: task.estimatedHours || 0
      });
    } else {
      setFormData({
        title: '',
        description: '',
        stateId: states.length > 0 ? states[0].id : 1,
        priorityId: priorities.length > 0 ? priorities[0].id : 1,
        projectId: projects.length > 0 ? projects[0].id : 1,
        asignedId: 0,
        expirationDate: '',
        estimatedHours: 0
      });
    }
  }, [task, states, priorities, projects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      expirationDate: new Date(formData.expirationDate).toISOString()
    };
    
    if (task?.id) {
      submitData.id = task.id;
    }
    
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title:
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description:
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Enter description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State:
        </label>
        <select
          name="stateId"
          value={formData.stateId}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {states.map(state => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority:
        </label>
        <select
          name="priorityId"
          value={formData.priorityId}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {priorities.map(priority => (
            <option key={priority.id} value={priority.id}>
              {priority.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project:
        </label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assigned to:
        </label>
        <select
          name="asignedId"
          value={formData.asignedId}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value={0}>Unassigned</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expiration Date:
        </label>
        <input
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          required
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Hours:
        </label>
        <input
          type="number"
          name="estimatedHours"
          value={formData.estimatedHours}
          onChange={handleChange}
          min="0"
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={disabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {disabled && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {task?.id ? 'Update' : 'Add'}
        </button>
        
        {task?.id && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        )}
        
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};

export default TaskForm;