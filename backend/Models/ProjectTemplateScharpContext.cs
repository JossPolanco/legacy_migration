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

    public virtual DbSet<TblTask> TblTasks { get; set; }

    public virtual DbSet<TblProjects> TblProjects { get; set; }

    public virtual DbSet<TblStates> TblStates { get; set; }

    public virtual DbSet<TblPriorities> TblPriorities { get; set; }

    public virtual DbSet<TblComments> TblComments { get; set; }


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

        modelBuilder.Entity<TblTask>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tbl_task_pkey");

            entity.ToTable("tbl_task");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title)
                .HasColumnName("title");
            entity.Property(e => e.Description)
                .HasColumnName("description");
            entity.Property(e => e.StateId)
                .HasColumnName("state_id");
            entity.Property(e => e.PriorityId)
                .HasColumnName("priority_id");
            entity.Property(e => e.ProjectId)
                .HasColumnName("project_id");
            entity.Property(e => e.AsignedId)
                .HasColumnName("asigned_id");
            entity.Property(e => e.ExpirationDate)
                .HasColumnName("expiration_date");
            entity.Property(e => e.EstimatedHours)
                .HasDefaultValue(0)
                .HasColumnName("estimated_hours");
            entity.Property(e => e.Usercreate)
                .HasColumnName("usercreate");
            entity.Property(e => e.Usermod)
                .HasColumnName("usermod");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("creation_date");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modification_date");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
        });

        modelBuilder.Entity<TblProjects>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tbl_projects_pkey");

            entity.ToTable("tbl_projects");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasColumnName("name");
            entity.Property(e => e.Description)
                .HasColumnName("description");
            entity.Property(e => e.Usercreate)
                .HasColumnName("usercreate");
            entity.Property(e => e.Usermod)
                .HasColumnName("usermod");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("creation_date");
            entity.Property(e => e.ModificationDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modification_date");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
        });

        modelBuilder.Entity<TblStates>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tbl_states_pkey");

            entity.ToTable("tbl_states");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasColumnName("name");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("creation_date");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
        });

        modelBuilder.Entity<TblPriorities>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tbl_priorities_pkey");

            entity.ToTable("tbl_priorities");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasColumnName("name");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("creation_date");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
        });

        modelBuilder.Entity<TblComments>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tbl_comments_pkey");

            entity.ToTable("tbl_comments");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TaskId).HasColumnName("task_id");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.UserCreate).HasColumnName("usercreate");
            entity.Property(e => e.UserMod).HasColumnName("usermod");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("creation_date");
            entity.Property(e => e.ModificationDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modification_date");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
