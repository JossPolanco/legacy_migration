using Template_API.DTOs;
using Template_API.Models;

namespace Template_API.Interfaces
{
    public interface INotificationService
    {
        Task<Response<List<NotificationResponseDto>>> GetNotificationsByUserIdAsync(int userId);
        Task<Response<NotificationResponseDto>> CreateNotificationAsync(NotificationRequestDto notificationDto);
        Task<Response<bool>> MarkNotificationsAsReadAsync(int userId);
        Task<Response<bool>> MarkNotificationAsReadAsync(int notificationId);
        Task<Response<int>> GetUnreadNotificationCountAsync(int userId);
    }
}