using Microsoft.EntityFrameworkCore;
using Template_API.DTOs;
using Template_API.Interfaces;
using Template_API.Models;

namespace Template_API.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ProjectTemplateScharpContext _context;

        public ProjectService(ProjectTemplateScharpContext context)
        {
            _context = context;
        }

        public async Task<Response<List<ProjectResponseDto>>> GetAllProjectsAsync()
        {
            try
            {
                var projects = await _context.TblProjects
                    .Where(p => p.Active == true)
                    .OrderByDescending(p => p.CreationDate)
                    .ToListAsync();

                var projectDtos = projects.Select(p => new ProjectResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Usercreate = p.Usercreate,
                    Usermod = p.Usermod,
                    CreationDate = p.CreationDate,
                    ModificationDate = p.ModificationDate,
                    Active = p.Active
                }).ToList();

                return new Response<List<ProjectResponseDto>>
                {
                    Success = true,
                    Message = "Proyectos obtenidos exitosamente",
                    Data = projectDtos
                };
            }
            catch (Exception ex)
            {
                return new Response<List<ProjectResponseDto>>
                {
                    Success = false,
                    Message = $"Error al obtener proyectos: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<ProjectResponseDto>> GetProjectByIdAsync(int id)
        {
            try
            {
                var project = await _context.TblProjects
                    .FirstOrDefaultAsync(p => p.Id == id && p.Active == true);

                if (project == null)
                {
                    return new Response<ProjectResponseDto>
                    {
                        Success = false,
                        Message = "Proyecto no encontrado",
                        Data = null
                    };
                }

                var projectDto = new ProjectResponseDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description,
                    Usercreate = project.Usercreate,
                    Usermod = project.Usermod,
                    CreationDate = project.CreationDate,
                    ModificationDate = project.ModificationDate,
                    Active = project.Active
                };

                return new Response<ProjectResponseDto>
                {
                    Success = true,
                    Message = "Proyecto obtenido exitosamente",
                    Data = projectDto
                };
            }
            catch (Exception ex)
            {
                return new Response<ProjectResponseDto>
                {
                    Success = false,
                    Message = $"Error al obtener proyecto: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<ProjectResponseDto>> CreateProjectAsync(ProjectRequestDto projectRequest, int userId)
        {
            try
            {
                var newProject = new TblProjects
                {
                    Name = projectRequest.Name,
                    Description = projectRequest.Description,
                    Usercreate = userId,
                    CreationDate = DateTime.Now,
                    ModificationDate = DateTime.Now,
                    Active = true
                };

                _context.TblProjects.Add(newProject);
                await _context.SaveChangesAsync();

                var projectDto = new ProjectResponseDto
                {
                    Id = newProject.Id,
                    Name = newProject.Name,
                    Description = newProject.Description,
                    Usercreate = newProject.Usercreate,
                    Usermod = newProject.Usermod,
                    CreationDate = newProject.CreationDate,
                    ModificationDate = newProject.ModificationDate,
                    Active = newProject.Active
                };

                return new Response<ProjectResponseDto>
                {
                    Success = true,
                    Message = "Proyecto creado exitosamente",
                    Data = projectDto
                };
            }
            catch (Exception ex)
            {
                return new Response<ProjectResponseDto>
                {
                    Success = false,
                    Message = $"Error al crear proyecto: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<ProjectResponseDto>> UpdateProjectAsync(ProjectUpdateDto projectUpdate, int userId)
        {
            try
            {
                var project = await _context.TblProjects
                    .FirstOrDefaultAsync(p => p.Id == projectUpdate.Id && p.Active == true);

                if (project == null)
                {
                    return new Response<ProjectResponseDto>
                    {
                        Success = false,
                        Message = "Proyecto no encontrado",
                        Data = null
                    };
                }

                project.Name = projectUpdate.Name;
                project.Description = projectUpdate.Description;
                project.Usermod = userId;
                project.ModificationDate = DateTime.Now;

                _context.TblProjects.Update(project);
                await _context.SaveChangesAsync();

                var projectDto = new ProjectResponseDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description,
                    Usercreate = project.Usercreate,
                    Usermod = project.Usermod,
                    CreationDate = project.CreationDate,
                    ModificationDate = project.ModificationDate,
                    Active = project.Active
                };

                return new Response<ProjectResponseDto>
                {
                    Success = true,
                    Message = "Proyecto actualizado exitosamente",
                    Data = projectDto
                };
            }
            catch (Exception ex)
            {
                return new Response<ProjectResponseDto>
                {
                    Success = false,
                    Message = $"Error al actualizar proyecto: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<bool>> DeleteProjectAsync(int id, int userId)
        {
            try
            {
                var project = await _context.TblProjects
                    .FirstOrDefaultAsync(p => p.Id == id && p.Active == true);

                if (project == null)
                {
                    return new Response<bool>
                    {
                        Success = false,
                        Message = "Proyecto no encontrado",
                        Data = false
                    };
                }

                // Soft delete
                project.Active = false;
                project.Usermod = userId;
                project.ModificationDate = DateTime.Now;

                _context.TblProjects.Update(project);
                await _context.SaveChangesAsync();

                return new Response<bool>
                {
                    Success = true,
                    Message = "Proyecto eliminado exitosamente",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new Response<bool>
                {
                    Success = false,
                    Message = $"Error al eliminar proyecto: {ex.Message}",
                    Data = false
                };
            }
        }
    }
}