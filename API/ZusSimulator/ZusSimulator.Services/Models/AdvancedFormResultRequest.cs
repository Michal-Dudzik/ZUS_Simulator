namespace ZusSimulator.Services.Models
{
    public class AdvancedFormResultRequest
    {
        public int CurrentAge { get; set; }

        public decimal MonthlyIncome { get; set; }

        public string EmploymentType { get; set; }

        public string Gender { get; set; }

        public DateTime WorkStartDate { get; set; }

        public decimal InitialCapital { get; set; } = 0;

        public int RetirementAge { get; set; }
        public decimal AccountBalance { get; set; }
        public decimal SubAccountBalance { get; set; }
        public int SickLeaveDays { get; set; }
    }
}