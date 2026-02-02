using System;

namespace Template_API.DTOs
{
    public class TaskRequestDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int StateId { get; set; }
        public int PriorityId { get; set; }
        public int ProjectId { get; set; }
        public int AsignedId { get; set; }
        public DateTime ExpirationDate { get; set; }
        public int EstimatedHours { get; set; } = 0;
    }

    public class TaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int StateId { get; set; }
        public string? StateName { get; set; }
        public int PriorityId { get; set; }
        public string? PriorityName { get; set; }
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int AsignedId { get; set; }
        public string? AsignedName { get; set; }
        public DateTime ExpirationDate { get; set; }
        public int EstimatedHours { get; set; }
        public int Usercreate { get; set; }
        public int? Usermod { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? ModificationDate { get; set; }
        public bool? Active { get; set; }
    }

    public class TaskUpdateDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int StateId { get; set; }
        public int PriorityId { get; set; }
        public int ProjectId { get; set; }
        public int AsignedId { get; set; }
        public DateTime ExpirationDate { get; set; }
        public int EstimatedHours { get; set; }
    }

    public class TaskStatisticsDto
    {
        public int Total { get; set; }
        public int Completed { get; set; }
        public int Pending { get; set; }
        public int HighPriority { get; set; }
        public int Overdue { get; set; }
    }
}