using System;
using System.Collections.Generic;

namespace Template_API.Models;

public partial class TblUser
{
    public int Id { get; set; }

    public string? Nickname { get; set; }

    public string? Password { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string? Email { get; set; }

    public int? Role { get; set; }

    public int? Usercreate { get; set; }

    public int? Usermod { get; set; }

    public DateTime? CreationDate { get; set; }

    public DateTime? ModificationDate { get; set; }

    public short? Active { get; set; }
}
