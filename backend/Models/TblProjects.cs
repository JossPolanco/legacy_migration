using System;
using System.Collections.Generic;

namespace Template_API.Models;

public partial class TblProjects
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int Usercreate { get; set; }

    public int? Usermod { get; set; }

    public DateTime? CreationDate { get; set; }

    public DateTime? ModificationDate { get; set; }

    public bool? Active { get; set; }
}