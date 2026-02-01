using System;

namespace Template_API.DTOs
{
    // DTOs para Projects (CRUD completo)
    public class ProjectRequestDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }

    public class ProjectResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Usercreate { get; set; }
        public int? Usermod { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? ModificationDate { get; set; }
        public bool? Active { get; set; }
    }

    public class ProjectUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }

    // DTOs para States (Solo lectura)
    public class StateResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime? CreationDate { get; set; }
        public bool? Active { get; set; }
    }

    // DTOs para Priorities (Solo lectura)
    public class PriorityResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime? CreationDate { get; set; }
        public bool? Active { get; set; }
    }
}