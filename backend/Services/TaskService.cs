using Microsoft.EntityFrameworkCore;
using Template_API.DTOs;
using Template_API.Interfaces;
using Template_API.Models;

namespace Template_API.Services
{
    public class TaskService : ITaskService
    {
        private readonly ProjectTemplateScharpContext _context;

        public TaskService(ProjectTemplateScharpContext context)
        {
            _context = context;
        }

        public async Task<Response<List<TaskResponseDto>>> GetAllTasksAsync()
        {
            try
            {
                var tasks = await _context.TblTasks
                    .Where(t => t.Active == true)
                    .OrderByDescending(t => t.CreationDate)
                    .ToListAsync();

                var taskDtos = tasks.Select(t => new TaskResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    StateId = t.StateId,
                    StateName = GetStateName(t.StateId),
                    PriorityId = t.PriorityId,
                    PriorityName = GetPriorityName(t.PriorityId),
                    ProjectId = t.ProjectId,
                    ProjectName = GetProjectName(t.ProjectId),
                    AsignedId = t.AsignedId,
                    AsignedName = GetUserName(t.AsignedId),
                    ExpirationDate = t.ExpirationDate.ToDateTime(TimeOnly.MinValue),
                    EstimatedHours = t.EstimatedHours,
                    Usercreate = t.Usercreate,
                    Usermod = t.Usermod,
                    CreationDate = t.CreationDate,
                    ModificationDate = t.ModificationDate,
                    Active = t.Active
                }).ToList();

                return new Response<List<TaskResponseDto>>
                {
                    Success = true,
                    Message = "Tareas obtenidas exitosamente",
                    Data = taskDtos
                };
            }
            catch (Exception ex)
            {
                return new Response<List<TaskResponseDto>>
                {
                    Success = false,
                    Message = $"Error al obtener tareas: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<TaskResponseDto>> GetTaskByIdAsync(int id)
        {
            try
            {
                var task = await _context.TblTasks
                    .FirstOrDefaultAsync(t => t.Id == id && t.Active == true);

                if (task == null)
                {
                    return new Response<TaskResponseDto>
                    {
                        Success = false,
                        Message = "Tarea no encontrada",
                        Data = null
                    };
                }

                var taskDto = new TaskResponseDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    StateId = task.StateId,
                    StateName = GetStateName(task.StateId),
                    PriorityId = task.PriorityId,
                    PriorityName = GetPriorityName(task.PriorityId),
                    ProjectId = task.ProjectId,
                    ProjectName = GetProjectName(task.ProjectId),
                    AsignedId = task.AsignedId,
                    AsignedName = GetUserName(task.AsignedId),
                    ExpirationDate = task.ExpirationDate.ToDateTime(TimeOnly.MinValue),
                    EstimatedHours = task.EstimatedHours,
                    Usercreate = task.Usercreate,
                    Usermod = task.Usermod,
                    CreationDate = task.CreationDate,
                    ModificationDate = task.ModificationDate,
                    Active = task.Active
                };

                return new Response<TaskResponseDto>
                {
                    Success = true,
                    Message = "Tarea obtenida exitosamente",
                    Data = taskDto
                };
            }
            catch (Exception ex)
            {
                return new Response<TaskResponseDto>
                {
                    Success = false,
                    Message = $"Error al obtener tarea: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<TaskResponseDto>> CreateTaskAsync(TaskRequestDto taskRequest, int userId)
        {
            try
            {
                var newTask = new TblTask
                {
                    Title = taskRequest.Title,
                    Description = taskRequest.Description,
                    StateId = taskRequest.StateId,
                    PriorityId = taskRequest.PriorityId,
                    ProjectId = taskRequest.ProjectId,
                    AsignedId = taskRequest.AsignedId,
                    ExpirationDate = DateOnly.FromDateTime(taskRequest.ExpirationDate),
                    EstimatedHours = taskRequest.EstimatedHours,
                    Usercreate = userId,
                    CreationDate = DateTime.Now,
                    ModificationDate = DateTime.Now,
                    Active = true
                };

                _context.TblTasks.Add(newTask);
                await _context.SaveChangesAsync();

                var taskDto = new TaskResponseDto
                {
                    Id = newTask.Id,
                    Title = newTask.Title,
                    Description = newTask.Description,
                    StateId = newTask.StateId,
                    StateName = GetStateName(newTask.StateId),
                    PriorityId = newTask.PriorityId,
                    PriorityName = GetPriorityName(newTask.PriorityId),
                    ProjectId = newTask.ProjectId,
                    ProjectName = GetProjectName(newTask.ProjectId),
                    AsignedId = newTask.AsignedId,
                    AsignedName = GetUserName(newTask.AsignedId),
                    ExpirationDate = newTask.ExpirationDate.ToDateTime(TimeOnly.MinValue),
                    EstimatedHours = newTask.EstimatedHours,
                    Usercreate = newTask.Usercreate,
                    Usermod = newTask.Usermod,
                    CreationDate = newTask.CreationDate,
                    ModificationDate = newTask.ModificationDate,
                    Active = newTask.Active
                };

                return new Response<TaskResponseDto>
                {
                    Success = true,
                    Message = "Tarea creada exitosamente",
                    Data = taskDto
                };
            }
            catch (Exception ex)
            {
                return new Response<TaskResponseDto>
                {
                    Success = false,
                    Message = $"Error al crear tarea: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<TaskResponseDto>> UpdateTaskAsync(TaskUpdateDto taskUpdate, int userId)
        {
            try
            {
                var task = await _context.TblTasks
                    .FirstOrDefaultAsync(t => t.Id == taskUpdate.Id && t.Active == true);

                if (task == null)
                {
                    return new Response<TaskResponseDto>
                    {
                        Success = false,
                        Message = "Tarea no encontrada",
                        Data = null
                    };
                }

                task.Title = taskUpdate.Title;
                task.Description = taskUpdate.Description;
                task.StateId = taskUpdate.StateId;
                task.PriorityId = taskUpdate.PriorityId;
                task.ProjectId = taskUpdate.ProjectId;
                task.AsignedId = taskUpdate.AsignedId;
                task.ExpirationDate = DateOnly.FromDateTime(taskUpdate.ExpirationDate);
                task.EstimatedHours = taskUpdate.EstimatedHours;
                task.Usermod = userId;
                task.ModificationDate = DateTime.Now;

                _context.TblTasks.Update(task);
                await _context.SaveChangesAsync();

                var taskDto = new TaskResponseDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    StateId = task.StateId,
                    StateName = GetStateName(task.StateId),
                    PriorityId = task.PriorityId,
                    PriorityName = GetPriorityName(task.PriorityId),
                    ProjectId = task.ProjectId,
                    ProjectName = GetProjectName(task.ProjectId),
                    AsignedId = task.AsignedId,
                    AsignedName = GetUserName(task.AsignedId),
                    ExpirationDate = task.ExpirationDate.ToDateTime(TimeOnly.MinValue),
                    EstimatedHours = task.EstimatedHours,
                    Usercreate = task.Usercreate,
                    Usermod = task.Usermod,
                    CreationDate = task.CreationDate,
                    ModificationDate = task.ModificationDate,
                    Active = task.Active
                };

                return new Response<TaskResponseDto>
                {
                    Success = true,
                    Message = "Tarea actualizada exitosamente",
                    Data = taskDto
                };
            }
            catch (Exception ex)
            {
                return new Response<TaskResponseDto>
                {
                    Success = false,
                    Message = $"Error al actualizar tarea: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<bool>> DeleteTaskAsync(int id, int userId)
        {
            try
            {
                var task = await _context.TblTasks
                    .FirstOrDefaultAsync(t => t.Id == id && t.Active == true);

                if (task == null)
                {
                    return new Response<bool>
                    {
                        Success = false,
                        Message = "Tarea no encontrada",
                        Data = false
                    };
                }

                // Soft delete
                task.Active = false;
                task.Usermod = userId;
                task.ModificationDate = DateTime.Now;

                _context.TblTasks.Update(task);
                await _context.SaveChangesAsync();

                return new Response<bool>
                {
                    Success = true,
                    Message = "Tarea eliminada exitosamente",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new Response<bool>
                {
                    Success = false,
                    Message = $"Error al eliminar tarea: {ex.Message}",
                    Data = false
                };
            }
        }

        public async Task<Response<TaskStatisticsDto>> GetTaskStatisticsAsync()
        {
            try
            {
                var activeTasks = await _context.TblTasks
                    .Where(t => t.Active == true)
                    .ToListAsync();

                var today = DateTime.Today;

                var statistics = new TaskStatisticsDto
                {
                    Total = activeTasks.Count,
                    Completed = activeTasks.Count(t => t.StateId == 3), // Assuming 3 is completed state
                    Pending = activeTasks.Count(t => t.StateId == 1), // Assuming 1 is pending state
                    HighPriority = activeTasks.Count(t => t.PriorityId == 3), // Assuming 3 is high priority
                    Overdue = activeTasks.Count(t => t.ExpirationDate.ToDateTime(TimeOnly.MinValue) < today && t.StateId != 3)
                };

                return new Response<TaskStatisticsDto>
                {
                    Success = true,
                    Message = "Estadísticas obtenidas exitosamente",
                    Data = statistics
                };
            }
            catch (Exception ex)
            {
                return new Response<TaskStatisticsDto>
                {
                    Success = false,
                    Message = $"Error al obtener estadísticas: {ex.Message}",
                    Data = null
                };
            }
        }

        private string GetStateName(int stateId)
        {
            var state = _context.TblStates.FirstOrDefault(s => s.Id == stateId && s.Active == true);
            return state?.Name ?? "Desconocido";
        }

        private string GetPriorityName(int priorityId)
        {
            var priority = _context.TblPriorities.FirstOrDefault(p => p.Id == priorityId && p.Active == true);
            return priority?.Name ?? "Desconocida";
        }

        private string GetProjectName(int projectId)
        {
            var project = _context.TblProjects.FirstOrDefault(p => p.Id == projectId && p.Active == true);
            return project?.Name ?? "Proyecto no encontrado";
        }

        private string GetUserName(int userId)
        {
            // This would ideally come from the Users table with a join
            var user = _context.TblUsers.FirstOrDefault(u => u.Id == userId);
            return user?.Username ?? "Sin asignar";
        }
    }
}