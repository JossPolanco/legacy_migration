using System;
using System.Collections.Generic;

namespace Template_API.Models;

public partial class TblStates
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? CreationDate { get; set; }

    public bool? Active { get; set; }
}