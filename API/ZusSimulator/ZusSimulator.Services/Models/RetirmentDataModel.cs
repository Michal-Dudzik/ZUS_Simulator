namespace ZusSimulator.Services.Models
{
    public class RetirmentDataModel
    {
        public DateTime BirthDate { get; set; }
        public int WorkYears { get; set; }
        public decimal Salary { get; set; }
        public bool IsPPK { get; set; }
        public bool IsDisabled { get; set; }
        public bool IsPrivlaged { get; set; }
        public bool IsFemale { get; set; }
    }
}