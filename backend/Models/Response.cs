namespace Template_API.Models
{
    public class Response
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }

    }
}
