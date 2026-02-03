using Template_API.DTOs;
using Template_API.Models;

namespace Template_API.Interfaces
{
    public interface ITaskService
    {
        Task<Response<List<TaskResponseDto>>> GetAllTasksAsync();
        Task<Response<TaskResponseDto>> GetTaskByIdAsync(int id);
        Task<Response<TaskResponseDto>> CreateTaskAsync(TaskRequestDto taskRequest, int userId);
        Task<Response<TaskResponseDto>> UpdateTaskAsync(TaskUpdateDto taskUpdate, int userId);
        Task<Response<bool>> DeleteTaskAsync(int id, int userId);
        Task<Response<TaskStatisticsDto>> GetTaskStatisticsAsync();
        Task<Response<List<dynamic>>> GetTasksByStateAsync();
        Task<Response<List<dynamic>>> GetTasksByProjectAsync();
        Task<Response<List<dynamic>>> GetTasksByUserAsync();
    }
}