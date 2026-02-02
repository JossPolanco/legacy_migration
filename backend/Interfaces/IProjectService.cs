using Template_API.DTOs;
using Template_API.Models;

namespace Template_API.Interfaces
{
    public interface IProjectService
    {
        Task<Response<List<ProjectResponseDto>>> GetAllProjectsAsync();
        Task<Response<ProjectResponseDto>> GetProjectByIdAsync(int id);
        Task<Response<ProjectResponseDto>> CreateProjectAsync(ProjectRequestDto projectRequest, int userId);
        Task<Response<ProjectResponseDto>> UpdateProjectAsync(ProjectUpdateDto projectUpdate, int userId);
        Task<Response<bool>> DeleteProjectAsync(int id, int userId);
    }
}