namespace Template_API.DTOs
{
    public class CommentRequestDto
    {
        public int TaskId { get; set; }
        public string Comment { get; set; } = null!;
    }

    public class CommentResponseDto
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string Comment { get; set; } = null!;
        public int UserCreate { get; set; }
        public string UserCreateName { get; set; } = null!;
        public int? UserMod { get; set; }
        public string? UserModName { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? ModificationDate { get; set; }
        public string TaskTitle { get; set; } = null!;
    }
}