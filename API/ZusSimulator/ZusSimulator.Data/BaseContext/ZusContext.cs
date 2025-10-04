using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZusSimulator.Data.BaseContext.Entities;

namespace ZusSimulator.Data.BaseContext
{
    public class ZusContext(DbContextOptions<ZusContext> options) : DbContext(options)
    {
        public DbSet<SimpleFormResult> SimpleFormResults { get; set; }
        public DbSet<AdvancedFormResult> AdvancedFormResults { get; set; }
    }
}
