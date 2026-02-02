using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Template_API.Models
{
    [Table("tbl_comments")]
    public partial class TblComments
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("task_id")]
        public int TaskId { get; set; }

        [Column("comment")]
        public string Comment { get; set; } = null!;

        [Column("usercreate")]
        public int UserCreate { get; set; }

        [Column("usermod")]
        public int? UserMod { get; set; }

        [Column("creation_date")]
        public DateTime CreationDate { get; set; }

        [Column("modification_date")]
        public DateTime? ModificationDate { get; set; }

        [Column("active")]
        public bool? Active { get; set; } = true;

        // Navigation properties
        [ForeignKey("TaskId")]
        public virtual TblTask? Task { get; set; }

        [ForeignKey("UserCreate")]
        public virtual TblUsers? UserCreateNavigation { get; set; }

        [ForeignKey("UserMod")]
        public virtual TblUsers? UserModNavigation { get; set; }
    }
}