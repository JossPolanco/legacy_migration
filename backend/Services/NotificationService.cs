using Microsoft.EntityFrameworkCore;
using Template_API.DTOs;
using Template_API.Interfaces;
using Template_API.Models;

namespace Template_API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ProjectTemplateScharpContext _context;

        public NotificationService(ProjectTemplateScharpContext context)
        {
            _context = context;
        }

        public async Task<Response<List<NotificationResponseDto>>> GetNotificationsByUserIdAsync(int userId)
        {
            try
            {
                Console.WriteLine($"DEBUG: Buscando notificaciones para userId={userId}");
                
                // Primero ver cuántas notificaciones hay en total
                var totalNotifications = await _context.TblNotifications.CountAsync();
                Console.WriteLine($"DEBUG: Total de notificaciones en DB: {totalNotifications}");
                
                // Ver cuántas tienen el userId
                var notificationsForUser = await _context.TblNotifications
                    .Where(n => n.UserId == userId)
                    .CountAsync();
                Console.WriteLine($"DEBUG: Notificaciones para userId {userId}: {notificationsForUser}");
                
                // Ver cuántas están activas
                var activeForUser = await _context.TblNotifications
                    .Where(n => n.UserId == userId && n.Active == true)
                    .CountAsync();
                Console.WriteLine($"DEBUG: Notificaciones activas para userId {userId}: {activeForUser}");
                
                var notifications = await (
                    from n in _context.TblNotifications
                    join u in _context.TblUsers on n.UserId equals u.Id
                    join t in _context.TblTasks on n.TaskId equals t.Id into taskJoin
                    from task in taskJoin.DefaultIfEmpty()
                    where n.UserId == userId && n.Active == true
                    orderby n.CreationDate descending
                    select new NotificationResponseDto
                    {
                        Id = n.Id,
                        UserId = n.UserId,
                        UserName = u.Username,
                        TaskId = n.TaskId,
                        TaskTitle = task != null ? task.Title : "Sin tarea asociada",
                        Title = n.Title,
                        Message = n.Message,
                        Type = n.Type,
                        Read = n.Read,
                        CreationDate = n.CreationDate,
                        ModificationDate = n.ModificationDate,
                        Active = n.Active
                    }
                ).ToListAsync();

                Console.WriteLine($"DEBUG: Notificaciones retornadas: {notifications.Count}");

                return new Response<List<NotificationResponseDto>>
                {
                    Success = true,
                    Message = "Notificaciones obtenidas exitosamente",
                    Data = notifications
                };
            }
            catch (Exception ex)
            {
                return new Response<List<NotificationResponseDto>>
                {
                    Success = false,
                    Message = $"Error al obtener notificaciones: {ex.Message}",
                    Data = new List<NotificationResponseDto>()
                };
            }
        }

        public async Task<Response<NotificationResponseDto>> CreateNotificationAsync(NotificationRequestDto notificationDto)
        {
            try
            {
                var notification = new TblNotifications
                {
                    UserId = notificationDto.UserId,
                    TaskId = notificationDto.TaskId,
                    Title = notificationDto.Title,
                    Message = notificationDto.Message,
                    Type = notificationDto.Type,
                    Read = false,
                    CreationDate = DateTime.UtcNow,
                    Active = true
                };

                _context.TblNotifications.Add(notification);
                await _context.SaveChangesAsync();

                var createdNotification = await (
                    from n in _context.TblNotifications
                    join u in _context.TblUsers on n.UserId equals u.Id
                    join t in _context.TblTasks on n.TaskId equals t.Id into taskJoin
                    from task in taskJoin.DefaultIfEmpty()
                    where n.Id == notification.Id
                    select new NotificationResponseDto
                    {
                        Id = n.Id,
                        UserId = n.UserId,
                        UserName = u.Username,
                        TaskId = n.TaskId,
                        TaskTitle = task != null ? task.Title : "Sin tarea asociada",
                        Title = n.Title,
                        Message = n.Message,
                        Type = n.Type,
                        Read = n.Read,
                        CreationDate = n.CreationDate,
                        ModificationDate = n.ModificationDate,
                        Active = n.Active
                    }
                ).FirstOrDefaultAsync();

                return new Response<NotificationResponseDto>
                {
                    Success = true,
                    Message = "Notificación creada exitosamente",
                    Data = createdNotification
                };
            }
            catch (Exception ex)
            {
                return new Response<NotificationResponseDto>
                {
                    Success = false,
                    Message = $"Error al crear notificación: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<Response<bool>> MarkNotificationsAsReadAsync(int userId)
        {
            try
            {
                var unreadNotifications = await _context.TblNotifications
                    .Where(n => n.UserId == userId && n.Read == false && n.Active == true)
                    .ToListAsync();

                foreach (var notification in unreadNotifications)
                {
                    notification.Read = true;
                    notification.ModificationDate = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return new Response<bool>
                {
                    Success = true,
                    Message = "Notificaciones marcadas como leídas",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new Response<bool>
                {
                    Success = false,
                    Message = $"Error al marcar notificaciones como leídas: {ex.Message}",
                    Data = false
                };
            }
        }

        public async Task<Response<bool>> MarkNotificationAsReadAsync(int notificationId)
        {
            try
            {
                var notification = await _context.TblNotifications
                    .FirstOrDefaultAsync(n => n.Id == notificationId);

                if (notification == null)
                {
                    return new Response<bool>
                    {
                        Success = false,
                        Message = "Notificación no encontrada",
                        Data = false
                    };
                }

                notification.Read = true;
                notification.ModificationDate = DateTime.Now;
                await _context.SaveChangesAsync();

                return new Response<bool>
                {
                    Success = true,
                    Message = "Notificación marcada como leída",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new Response<bool>
                {
                    Success = false,
                    Message = $"Error al marcar notificación como leída: {ex.Message}",
                    Data = false
                };
            }
        }

        public async Task<Response<int>> GetUnreadNotificationCountAsync(int userId)
        {
            try
            {
                var count = await _context.TblNotifications
                    .CountAsync(n => n.UserId == userId && n.Read == false && n.Active == true);

                return new Response<int>
                {
                    Success = true,
                    Message = "Conteo de notificaciones no leídas obtenido",
                    Data = count
                };
            }
            catch (Exception ex)
            {
                return new Response<int>
                {
                    Success = false,
                    Message = $"Error al obtener conteo de notificaciones: {ex.Message}",
                    Data = 0
                };
            }
        }
    }
}