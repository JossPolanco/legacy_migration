using Template_API.DTOs;

namespace Template_API.Interfaces;

public interface IHistoryService
{
    Task<List<HistoryDto>> GetHistoryByTaskIdAsync(int taskId);
    Task<List<HistoryDto>> GetAllHistoryAsync();
    Task<HistoryDto> CreateHistoryAsync(int taskId, string action, string description);
    Task<bool> DeleteHistoryAsync(int historyId);
}
