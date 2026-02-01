namespace Template_API.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public object User { get; set; } = new { };
    }
}
