using Microsoft.EntityFrameworkCore;
using Template_API.DTOs;
using Template_API.Interfaces;
using Template_API.Models;

namespace Template_API.Services;

public class HistoryService : IHistoryService
{
    private readonly ProjectTemplateScharpContext _context;

    public HistoryService(ProjectTemplateScharpContext context)
    {
        _context = context;
    }

    public async Task<List<HistoryDto>> GetHistoryByTaskIdAsync(int taskId)
    {
        return await _context.TblHistory
            .Where(h => h.TaskId == taskId && h.Active)
            .OrderByDescending(h => h.CreationDate)
            .Select(h => new HistoryDto
            {
                Id = h.Id,
                TaskId = h.TaskId,
                Action = h.Action,
                Description = h.Description,
                CreationDate = h.CreationDate,
                Active = h.Active
            })
            .ToListAsync();
    }

    public async Task<List<HistoryDto>> GetAllHistoryAsync()
    {
        return await _context.TblHistory
            .Where(h => h.Active)
            .OrderByDescending(h => h.CreationDate)
            .Select(h => new HistoryDto
            {
                Id = h.Id,
                TaskId = h.TaskId,
                Action = h.Action,
                Description = h.Description,
                CreationDate = h.CreationDate,
                Active = h.Active
            })
            .ToListAsync();
    }

    public async Task<HistoryDto> CreateHistoryAsync(int taskId, string action, string description)
    {
        var history = new TblHistory
        {
            TaskId = taskId,
            Action = action,
            Description = description,
            CreationDate = DateTime.Now,
            Active = true
        };

        _context.TblHistory.Add(history);
        await _context.SaveChangesAsync();

        return new HistoryDto
        {
            Id = history.Id,
            TaskId = history.TaskId,
            Action = history.Action,
            Description = history.Description,
            CreationDate = history.CreationDate,
            Active = history.Active
        };
    }

    public async Task<bool> DeleteHistoryAsync(int historyId)
    {
        var history = await _context.TblHistory.FindAsync(historyId);
        if (history == null)
            return false;

        history.Active = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
