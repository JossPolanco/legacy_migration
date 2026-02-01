// Dtos/LoginResponse.cs
namespace Template_API.Api.Models
{
    public class LoginResponse
    {
        public string Token { get; set; } = default!;
        public object User { get; set; } = default!;
    }
}