using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Template_API.DTOs;
using Template_API.Interfaces;
using System.Security.Claims;

namespace Template_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var result = await _projectService.GetAllProjectsAsync();
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var result = await _projectService.GetProjectByIdAsync(id);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return NotFound(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] ProjectRequestDto projectRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Usuario no válido");
            }

            var result = await _projectService.CreateProjectAsync(projectRequest, userId);
            
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetProjectById), new { id = result.Data?.Id }, result);
            }
            
            return BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProject([FromBody] ProjectUpdateDto projectUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Usuario no válido");
            }

            var result = await _projectService.UpdateProjectAsync(projectUpdate, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Usuario no válido");
            }

            var result = await _projectService.DeleteProjectAsync(id, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return NotFound(result);
        }
    }
}