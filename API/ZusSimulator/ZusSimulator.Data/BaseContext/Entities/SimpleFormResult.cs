using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ZusSimulator.Data.BaseContext.Entities
{
    public class SimpleFormResult
    {
        public int Id { get; set; }

        public int? CurrentAge { get; set; }

        public decimal? MonthlyIncome { get; set; }

        public string? EmploymentType { get; set; }

        public string? Gender { get; set; }

        public DateTime? WorkStartDate { get; set; }

        public decimal? InitialCapital { get; set; } = 0;

        public int? RetirementAge { get; set; }
        public string? Email { get; set; }
        public string? PostalCode { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
