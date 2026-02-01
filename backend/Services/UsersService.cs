using Template_API.Interfaces;
using Template_API.DTOs;
using Template_API.Models;

namespace Template_API.Services
{
    public class UsersService : IUsersService
    {
        private readonly ProjectTemplateScharpContext _context;
        public UsersService(ProjectTemplateScharpContext context) { 
            _context = context;
        }

        public List<UsersRequestoDto> GetUsers()
        {
            var users = _context.TblUsers.Select(u => new UsersRequestoDto
            {
                Username = u.Username,
                Password = u.Password
            }).ToList();
            return users;
        }
    }
}
