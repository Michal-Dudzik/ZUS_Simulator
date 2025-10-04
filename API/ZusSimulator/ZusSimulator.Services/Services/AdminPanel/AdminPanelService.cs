using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ZusSimulator.Data.BaseContext;

namespace ZusSimulator.Services.Services.AdminPanel
{
    public class AdminPanelService : IAdminPanelService
    {
        private readonly ZusContext zusContext;

        public AdminPanelService(ZusContext zusContext)
        {
            this.zusContext = zusContext;
        }

        public async Task<int> TotalAdvancedRequests()
        {
            return await zusContext.AdvancedFormResults.CountAsync();
        }

        public Task<IEnumerable<Tuple<string, double>>> TotalAveragess()
        {
            var listAdvanced = new List<Tuple<string, double>> { 
            new("InitialCapital", ((double?)zusContext.AdvancedFormResults.Average(x => x.InitialCapital)) ?? 0),
            new("SickLeaveDays", zusContext.AdvancedFormResults.Average(x => x.SickLeaveDays) ?? 0),
            new("CurrentAge", zusContext.AdvancedFormResults.Average(x => x.CurrentAge) ?? 0),
            new("AccountBalance", ((double?)zusContext.AdvancedFormResults.Average(x => x.AccountBalance)) ?? 0),
            new("MonthlyIncome", ((double?) zusContext.AdvancedFormResults.Average(x => x.MonthlyIncome)) ?? 0),
            new("RetirementAge", zusContext.AdvancedFormResults.Average(x => x.RetirementAge) ?? 0),
            new("SubAccountBalance", ((double ?) zusContext.AdvancedFormResults.Average(x => x.SubAccountBalance)) ?? 0),
            };

            var listSimple = new List<Tuple<string, double>> {
            new("InitialCapital", ((double?)zusContext.SimpleFormResults.Average(x => x.InitialCapital)) ?? 0),
            new("CurrentAge", zusContext.SimpleFormResults.Average(x => x.CurrentAge) ?? 0),
            new("MonthlyIncome", ((double?) zusContext.SimpleFormResults.Average(x => x.MonthlyIncome)) ?? 0),
            new("RetirementAge", zusContext.SimpleFormResults.Average(x => x.RetirementAge) ?? 0),
            };

            return Task.FromResult(listAdvanced.Concat(listSimple).AsEnumerable());
        }

        public Task<IEnumerable<Tuple<string, int>>> TotalMaxes()
        {
            var listAdvanced = new List<Tuple<string, int>> {
            new("InitialCapital", ((int?)zusContext.AdvancedFormResults.Max(x => x.InitialCapital)) ?? 0),
            new("SickLeaveDays", zusContext.AdvancedFormResults.Max(x => x.SickLeaveDays) ?? 0),
            new("CurrentAge", zusContext.AdvancedFormResults.Max(x => x.CurrentAge) ?? 0),
            new("AccountBalance", ((int?)zusContext.AdvancedFormResults.Max(x => x.AccountBalance)) ?? 0),
            new("MonthlyIncome", ((int?) zusContext.AdvancedFormResults.Max(x => x.MonthlyIncome)) ?? 0),
            new("RetirementAge", zusContext.AdvancedFormResults.Max(x => x.RetirementAge) ?? 0),
            new("SubAccountBalance", ((int?) zusContext.AdvancedFormResults.Max(x => x.SubAccountBalance)) ?? 0),
            };

            var listSimple = new List<Tuple<string, int>> {
            new("InitialCapital", ((int?)zusContext.SimpleFormResults.Max(x => x.InitialCapital)) ?? 0),
            new("CurrentAge", zusContext.SimpleFormResults.Max(x => x.CurrentAge) ?? 0),
            new("MonthlyIncome", ((int?) zusContext.SimpleFormResults.Max(x => x.MonthlyIncome)) ?? 0),
            new("RetirementAge", zusContext.SimpleFormResults.Max(x => x.RetirementAge) ?? 0),
            };

            return Task.FromResult(listAdvanced.Concat(listSimple).AsEnumerable());
        }

        public Task<IEnumerable<Tuple<string, int>>> TotalMins()
        {
            var listAdvanced = new List<Tuple<string, int>> {
            new("InitialCapital", ((int?)zusContext.AdvancedFormResults.Min(x => x.InitialCapital)) ?? 0),
            new("SickLeaveDays", zusContext.AdvancedFormResults.Min(x => x.SickLeaveDays) ?? 0),
            new("CurrentAge", zusContext.AdvancedFormResults.Min(x => x.CurrentAge) ?? 0),
            new("AccountBalance", ((int?)zusContext.AdvancedFormResults.Min(x => x.AccountBalance)) ?? 0),
            new("MonthlyIncome", ((int?) zusContext.AdvancedFormResults.Min(x => x.MonthlyIncome)) ?? 0),
            new("RetirementAge", zusContext.AdvancedFormResults.Min(x => x.RetirementAge) ?? 0),
            new("SubAccountBalance", ((int?) zusContext.AdvancedFormResults.Min(x => x.SubAccountBalance)) ?? 0),
            };

            var listSimple = new List<Tuple<string, int>> {
            new("InitialCapital", ((int?)zusContext.SimpleFormResults.Min(x => x.InitialCapital)) ?? 0),
            new("CurrentAge", zusContext.SimpleFormResults.Min(x => x.CurrentAge) ?? 0),
            new("MonthlyIncome", ((int?) zusContext.SimpleFormResults.Min(x => x.MonthlyIncome)) ?? 0),
            new("RetirementAge", zusContext.SimpleFormResults.Min(x => x.RetirementAge) ?? 0),
            };

            return Task.FromResult(listAdvanced.Concat(listSimple).AsEnumerable());
        }

        public Task<IEnumerable<IEnumerable<Tuple<string, double>>>> TotalPercentageUsage()
        {
            var advancedList = new List<IEnumerable<Tuple<string, double>>>
            {
                zusContext.AdvancedFormResults.GroupBy(x => x.EmploymentType)
                .Select(g => new Tuple<string, double>(g.Key, (double)g.Count() / zusContext.AdvancedFormResults.Count() * 100)),
                //zusContext.AdvancedFormResults.GroupBy(x => x.Gender)
                //.Select(g => new Tuple<string, double>(g.Key, (double)g.Count() / zusContext.AdvancedFormResults.Count() * 100)),
                //zusContext.AdvancedFormResults.GroupBy(x => x.SickLeaveDays)
                //.Select(g => new Tuple<string, double>(g.Key.ToString(), (double)g.Count() / zusContext.AdvancedFormResults.Count() * 100)),
                //zusContext.AdvancedFormResults.GroupBy(x => x.RetirementAge)
                //.Select(g => new Tuple<string, double>(g.Key.ToString(), (double)g.Count() / zusContext.AdvancedFormResults.Count() * 100)),
            };

            var test = JsonSerializer.Serialize(advancedList);

            var simpleList = new List<IEnumerable<Tuple<string, double>>>
            {
                zusContext.SimpleFormResults.GroupBy(x => x.EmploymentType)
                .Select(g => new Tuple<string, double>(g.Key, (double)g.Count() / zusContext.SimpleFormResults.Count() * 100)),
                //zusContext.SimpleFormResults.GroupBy(x => x.Gender)
                //.Select(g => new Tuple<string, double>(g.Key, (double)g.Count() / zusContext.SimpleFormResults.Count() * 100)),
                //zusContext.SimpleFormResults.GroupBy(x => x.RetirementAge)
                //.Select(g => new Tuple<string, double>(g.Key.ToString(), (double)g.Count() / zusContext.SimpleFormResults.Count() * 100)),
            };

            var test1 = JsonSerializer.Serialize(simpleList);


            return Task.FromResult(advancedList.Concat(simpleList));
        }

        public Task<int> TotalPersonalDataAdded()
        {
           return Task.FromResult(zusContext.SimpleFormResults.Where(x => x.Email != null).Count() + zusContext.AdvancedFormResults.Where(x => x.Email != null).Count());
        }

        public Task<int> TotalRequests()
        {
            return Task.FromResult(zusContext.SimpleFormResults.Count() + zusContext.AdvancedFormResults.Count());
        }

        public Task<int> TotalSimpleRequests()
        {
            return Task.FromResult(zusContext.SimpleFormResults.Count());
        }
    }
}
