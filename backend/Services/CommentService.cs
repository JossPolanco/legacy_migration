using Microsoft.EntityFrameworkCore;
using Template_API.DTOs;
using Template_API.Interfaces;
using Template_API.Models;

namespace Template_API.Services
{
    public class CommentService : ICommentService
    {
        private readonly ProjectTemplateScharpContext _db;

        public CommentService(ProjectTemplateScharpContext db)
        {
            _db = db;
        }

        public async Task<Response<List<CommentResponseDto>>> GetCommentsByTaskIdAsync(int taskId)
        {
            try
            {
                var comments = await _db.TblComments
                    .Where(c => c.TaskId == taskId && (c.Active ?? true))
                    .Include(c => c.UserCreateNavigation)
                    .Include(c => c.UserModNavigation)
                    .Include(c => c.Task)
                    .OrderByDescending(c => c.CreationDate)
                    .Select(c => new CommentResponseDto
                    {
                        Id = c.Id,
                        TaskId = c.TaskId,
                        Comment = c.Comment,
                        UserCreate = c.UserCreate,
                        UserCreateName = c.UserCreateNavigation!.Username ?? "Usuario Desconocido",
                        UserMod = c.UserMod,
                        UserModName = c.UserModNavigation != null ? c.UserModNavigation.Username : null,
                        CreationDate = c.CreationDate,
                        ModificationDate = c.ModificationDate,
                        TaskTitle = c.Task!.Title ?? "Tarea Sin Título"
                    })
                    .ToListAsync();

                return new Response<List<CommentResponseDto>>
                {
                    Success = true,
                    Data = comments,
                    Message = $"Found {comments.Count} comments for task {taskId}"
                };
            }
            catch (Exception ex)
            {
                return new Response<List<CommentResponseDto>>
                {
                    Success = false,
                    Data = new List<CommentResponseDto>(),
                    Message = $"Error retrieving comments: {ex.Message}"
                };
            }
        }

        public async Task<Response<List<CommentResponseDto>>> GetAllCommentsAsync()
        {
            try
            {
                var comments = await _db.TblComments
                    .Where(c => c.Active ?? true)
                    .Include(c => c.UserCreateNavigation)
                    .Include(c => c.UserModNavigation)
                    .Include(c => c.Task)
                    .OrderByDescending(c => c.CreationDate)
                    .Select(c => new CommentResponseDto
                    {
                        Id = c.Id,
                        TaskId = c.TaskId,
                        Comment = c.Comment,
                        UserCreate = c.UserCreate,
                        UserCreateName = c.UserCreateNavigation!.Username ?? "Usuario Desconocido",
                        UserMod = c.UserMod,
                        UserModName = c.UserModNavigation != null ? c.UserModNavigation.Username : null,
                        CreationDate = c.CreationDate,
                        ModificationDate = c.ModificationDate,
                        TaskTitle = c.Task!.Title ?? "Tarea Sin Título"
                    })
                    .ToListAsync();

                return new Response<List<CommentResponseDto>>
                {
                    Success = true,
                    Data = comments,
                    Message = $"Found {comments.Count} total comments"
                };
            }
            catch (Exception ex)
            {
                return new Response<List<CommentResponseDto>>
                {
                    Success = false,
                    Data = new List<CommentResponseDto>(),
                    Message = $"Error retrieving all comments: {ex.Message}"
                };
            }
        }

        public async Task<Response<CommentResponseDto>> CreateCommentAsync(CommentRequestDto commentDto, int userId)
        {
            try
            {
                // Verificar que la tarea existe
                var taskExists = await _db.TblTasks.AnyAsync(t => t.Id == commentDto.TaskId && (t.Active ?? true));
                if (!taskExists)
                {
                    return new Response<CommentResponseDto>
                    {
                        Success = false,
                        Data = null,
                        Message = "The specified task does not exist or is not active"
                    };
                }

                var comment = new TblComments
                {
                    TaskId = commentDto.TaskId,
                    Comment = commentDto.Comment,
                    UserCreate = userId,
                    Active = true
                    // CreationDate will be set by database default (now())
                    // ModificationDate remains null for new records
                };

                _db.TblComments.Add(comment);
                await _db.SaveChangesAsync();

                // Obtener el comentario creado con toda la información
                var createdComment = await _db.TblComments
                    .Where(c => c.Id == comment.Id)
                    .Include(c => c.UserCreateNavigation)
                    .Include(c => c.Task)
                    .Select(c => new CommentResponseDto
                    {
                        Id = c.Id,
                        TaskId = c.TaskId,
                        Comment = c.Comment,
                        UserCreate = c.UserCreate,
                        UserCreateName = c.UserCreateNavigation!.Username ?? "Unknown User",
                        UserMod = c.UserMod,
                        UserModName = null,
                        CreationDate = c.CreationDate,
                        ModificationDate = c.ModificationDate,
                        TaskTitle = c.Task!.Title ?? "Task Without Title"
                    })
                    .FirstAsync();

                return new Response<CommentResponseDto>
                {
                    Success = true,
                    Data = createdComment,
                    Message = "Comment created successfully"
                };
            }
            catch (Exception ex)
            {
                return new Response<CommentResponseDto>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error creating comment: {ex.Message}"
                };
            }
        }
    }
}