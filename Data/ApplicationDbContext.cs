using ElectroGO.Models;
using Microsoft.EntityFrameworkCore;

namespace ElectroGO.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}
