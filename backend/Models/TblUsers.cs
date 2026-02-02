using System;
using System.Collections.Generic;

namespace Template_API.Models;

public partial class TblUsers
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public DateTime? CreationDate { get; set; }

    public bool? Active { get; set; }
}
