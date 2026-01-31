using Template_API.DTOs;

namespace Template_API.Interfaces
{
    public interface IUsersService
    {
        List<UsersRequestoDto> GetUsers();
    }
}
