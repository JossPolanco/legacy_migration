using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Template_API.DTOs;
using Template_API.Models;
using Template_API.Services;

namespace Template_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ProjectTemplateScharpContext _db;
        private readonly JwtTokenService _jwt;

        public AuthController(ProjectTemplateScharpContext db, JwtTokenService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest("Username y password son requeridos");

            var user = await _db.TblUsers.FirstOrDefaultAsync(u => u.Username == req.Username);
            if (user == null || !(user.Active ?? false))
                return Unauthorized();

            var ok = string.Equals(user.Password, req.Password);
            if (!ok) return Unauthorized();

            var token = _jwt.CreateToken(user);
            return Ok(new LoginResponse
            {
                Token = token,
                User = new { id = user.Id, username = user.Username }
            });
            
        }
    }
}
