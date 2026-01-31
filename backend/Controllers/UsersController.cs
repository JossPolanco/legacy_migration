using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Template_API.Interfaces;
using Template_API.Models;

namespace Template_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly IUsersService _usersService;
        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }
        [HttpGet]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _usersService.GetUsers();

                return Ok(new Response
                {
                    IsSuccess = true,
                    Message = "Users retrieved successfully.",
                    Data = users
                });
            } catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    IsSuccess = false,
                    Message = ex.Message,
                    Data = null
                });
            }
        }
    }
}
