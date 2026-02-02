using System;

namespace Template_API.DTOs;

public class HistoryDto
{
    public int Id { get; set; }

    public int TaskId { get; set; }

    public string Action { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime CreationDate { get; set; }

    public bool Active { get; set; }
}
