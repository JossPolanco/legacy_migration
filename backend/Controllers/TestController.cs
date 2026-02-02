using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Template_API.DTOs;
using Template_API.Models;
using Template_API.Services;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly ProjectTemplateScharpContext _context;

    public TestController(ProjectTemplateScharpContext context)
    {
        _context = context;
    }

    [HttpGet("test-connection")]
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            if (canConnect)
            {
                var userCount = await _context.TblUsers.CountAsync();
                return Ok(new { 
                    success = true, 
                    message = "Conexión exitosa", 
                    userCount = userCount 
                });
            }
            return StatusCode(500, new { success = false, message = "No se pudo conectar" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                success = false, 
                message = ex.Message,
                innerException = ex.InnerException?.Message 
            });
        }
    }
}