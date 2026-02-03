using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Template_API.DTOs;
using Template_API.Interfaces;
using Template_API.Models;
using System.Security.Claims;

namespace Template_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ProjectTemplateScharpContext _context;

        public TasksController(ITaskService taskService, ProjectTemplateScharpContext context)
        {
            _taskService = taskService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var result = await _taskService.GetAllTasksAsync();
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var result = await _taskService.GetTaskByIdAsync(id);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return NotFound(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskRequestDto taskRequest)
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

            var result = await _taskService.CreateTaskAsync(taskRequest, userId);
            
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetTaskById), new { id = result.Data?.Id }, result);
            }
            
            return BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTask([FromBody] TaskUpdateDto taskUpdate)
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

            var result = await _taskService.UpdateTaskAsync(taskUpdate, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Usuario no válido");
            }

            var result = await _taskService.DeleteTaskAsync(id, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return NotFound(result);
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> GetTaskStatistics()
        {
            var result = await _taskService.GetTaskStatisticsAsync();
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _context.TblUsers
                    .Where(u => u.Active == true)
                    .Select(u => new { id = u.Id, username = u.Username })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Users retrieved successfully",
                    data = users
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error al obtener usuarios: {ex.Message}",
                    data = (object?)null
                });
            }
        }

        [HttpGet("projects")]
        public async Task<IActionResult> GetProjects()
        {
            try
            {
                var projects = await _context.TblProjects
                    .Where(p => p.Active == true)
                    .Select(p => new { id = p.Id, name = p.Name })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Projects retrieved successfully",
                    data = projects
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error al obtener proyectos: {ex.Message}",
                    data = (object?)null
                });
            }
        }

        [HttpGet("states")]
        public async Task<IActionResult> GetStates()
        {
            try
            {
                var states = await _context.TblStates
                    .Where(s => s.Active == true)
                    .Select(s => new { id = s.Id, name = s.Name })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "States retrieved successfully",
                    data = states
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error al obtener estados: {ex.Message}",
                    data = (object?)null
                });
            }
        }

        [HttpGet("priorities")]
        public async Task<IActionResult> GetPriorities()
        {
            try
            {
                var priorities = await _context.TblPriorities
                    .Where(p => p.Active == true)
                    .Select(p => new { id = p.Id, name = p.Name })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Priorities retrieved successfully",
                    data = priorities
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error al obtener prioridades: {ex.Message}",
                    data = (object?)null
                });
            }
        }

        [HttpGet("report/by-state")]
        public async Task<IActionResult> GetTasksByState()
        {
            var result = await _taskService.GetTasksByStateAsync();

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("report/by-project")]
        public async Task<IActionResult> GetTasksByProject()
        {
            var result = await _taskService.GetTasksByProjectAsync();

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("report/by-user")]
        public async Task<IActionResult> GetTasksByUser()
        {
            var result = await _taskService.GetTasksByUserAsync();

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}