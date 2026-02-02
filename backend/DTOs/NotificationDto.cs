using System;

namespace Template_API.DTOs
{
    public class NotificationRequestDto
    {
        public int UserId { get; set; }
        public int TaskId { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Type { get; set; } = null!;
    }

    public class NotificationResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public int TaskId { get; set; }
        public string? TaskTitle { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Type { get; set; } = null!;
        public bool Read { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? ModificationDate { get; set; }
        public bool? Active { get; set; }
    }

    public class MarkReadRequestDto
    {
        public int UserId { get; set; }
    }
}