using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Contacts;

namespace Portfolio.Infrastructure.Persistence;

public sealed class PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : DbContext(options)
{
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var contact = modelBuilder.Entity<ContactSubmission>();
        contact.ToTable("ContactSubmissions");
        contact.HasKey(item => item.Id);
        contact.Property(item => item.Name).HasMaxLength(100).IsRequired();
        contact.Property(item => item.Email).HasMaxLength(254).IsRequired();
        contact.Property(item => item.Subject).HasMaxLength(160).IsRequired();
        contact.Property(item => item.Message).HasMaxLength(4000).IsRequired();
        contact.Property(item => item.RequesterHash).HasMaxLength(64).IsRequired();
        contact.HasIndex(item => item.CreatedAt);
    }
}
