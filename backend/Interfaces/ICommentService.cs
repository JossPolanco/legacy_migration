using Template_API.DTOs;
using Template_API.Models;

namespace Template_API.Interfaces
{
    public interface ICommentService
    {
        Task<Response<List<CommentResponseDto>>> GetCommentsByTaskIdAsync(int taskId);
        Task<Response<List<CommentResponseDto>>> GetAllCommentsAsync();
        Task<Response<CommentResponseDto>> CreateCommentAsync(CommentRequestDto commentDto, int userId);
    }
}