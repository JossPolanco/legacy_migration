using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Template_API.DTOs;
using Template_API.Interfaces;
using Template_API.Models;

namespace Template_API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyService;

    public HistoryController(IHistoryService historyService)
    {
        _historyService = historyService;
    }

    [HttpGet("task/{taskId}")]
    public async Task<IActionResult> GetHistoryByTaskId(int taskId)
    {
        try
        {
            var history = await _historyService.GetHistoryByTaskIdAsync(taskId);
            return Ok(new { success = true, data = history });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllHistory()
    {
        try
        {
            var history = await _historyService.GetAllHistoryAsync();
            return Ok(new { success = true, data = history });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateHistory([FromBody] CreateHistoryRequest request)
    {
        try
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Action) || string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest(new { success = false, message = "Invalid request data" });
            }

            var history = await _historyService.CreateHistoryAsync(request.TaskId, request.Action, request.Description);
            return Ok(new { success = true, data = history });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{historyId}")]
    public async Task<IActionResult> DeleteHistory(int historyId)
    {
        try
        {
            var result = await _historyService.DeleteHistoryAsync(historyId);
            if (!result)
                return NotFound(new { success = false, message = "History not found" });

            return Ok(new { success = true, message = "History deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
