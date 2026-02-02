using System;
using System.Collections.Generic;

namespace Template_API.Models;

public partial class TblNotifications
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int TaskId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string Type { get; set; } = null!;

    public bool Read { get; set; } = false;

    public DateTime? CreationDate { get; set; }

    public DateTime? ModificationDate { get; set; }

    public bool? Active { get; set; } = true;

    public virtual TblUsers User { get; set; } = null!;

    public virtual TblTask Task { get; set; } = null!;
}