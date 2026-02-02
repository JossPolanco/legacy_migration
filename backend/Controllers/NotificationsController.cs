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
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetNotificationsByUserId(int userId)
        {
            var result = await _notificationService.GetNotificationsByUserIdAsync(userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpGet("user/{userId}/unread-count")]
        public async Task<IActionResult> GetUnreadNotificationCount(int userId)
        {
            var result = await _notificationService.GetUnreadNotificationCountAsync(userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationRequestDto notificationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _notificationService.CreateNotificationAsync(notificationDto);
            
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetNotificationsByUserId), new { userId = notificationDto.UserId }, result);
            }
            
            return BadRequest(result);
        }

        [HttpPut("mark-all-read/{userId}")]
        public async Task<IActionResult> MarkAllNotificationsAsRead(int userId)
        {
            var result = await _notificationService.MarkNotificationsAsReadAsync(userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPut("mark-read/{notificationId}")]
        public async Task<IActionResult> MarkNotificationAsRead(int notificationId)
        {
            var result = await _notificationService.MarkNotificationAsReadAsync(notificationId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
    }
}