namespace Template_API.DTOs;

public class CreateHistoryRequest
{
    public int TaskId { get; set; }
    public string Action { get; set; } = null!;
    public string Description { get; set; } = null!;
}
