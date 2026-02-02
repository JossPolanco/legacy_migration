using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Template_API.DTOs;
using Template_API.Interfaces;

namespace Template_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("task/{taskId}")]
        public async Task<IActionResult> GetCommentsByTaskId(int taskId)
        {
            var response = await _commentService.GetCommentsByTaskIdAsync(taskId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllComments()
        {
            var response = await _commentService.GetAllCommentsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CommentRequestDto commentDto)
        {
            if (string.IsNullOrWhiteSpace(commentDto.Comment))
            {
                return BadRequest(new { Success = false, Message = "El comentario es requerido" });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { Success = false, Message = "Usuario no autenticado" });
            }

            var response = await _commentService.CreateCommentAsync(commentDto, userId);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}