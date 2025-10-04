using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZusSimulator.Services.Models
{
    public class SimpleFormResultRequest
    {
        public int CurrentAge { get; set; }

        public decimal MonthlyIncome { get; set; }

        public string EmploymentType { get; set; }

        public string Gender { get; set; }

        public DateTime WorkStartDate { get; set; }

        public decimal InitialCapital { get; set; } = 0;

        public int RetirementAge { get; set; }
    }
}
