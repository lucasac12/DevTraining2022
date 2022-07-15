using Microsoft.EntityFrameworkCore;
using ProjDevTraining.Models;

namespace ProjDevTraining.Data
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        { }

        public DbSet<ProfissionalModel> Profissional { get; set; }
    }
}
