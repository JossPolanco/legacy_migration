using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Template_API.Models;

public partial class ProjectTemplateScharpContext : DbContext
{
    public ProjectTemplateScharpContext()
    {
    }

    public ProjectTemplateScharpContext(DbContextOptions<ProjectTemplateScharpContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TblUsers> TblUsers { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<TblUsers>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tbl_users_pkey");

            entity.ToTable("tbl_users");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("creation_date");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
