namespace Template_API.DTOs
{
    public class CreateUserRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
