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

        public async Task<IEnumerable<Tuple<string, double>>> TotalAveragess()
        {
            var listAdvanced = new List<Tuple<string, double>> {
                new("InitialCapital", ((double?)await zusContext.AdvancedFormResults.AverageAsync(x => x.InitialCapital)) ?? 0),
                new("SickLeaveDays", await zusContext.AdvancedFormResults.AverageAsync(x => x.SickLeaveDays) ?? 0),
                new("CurrentAge", await zusContext.AdvancedFormResults.AverageAsync(x => x.CurrentAge) ?? 0),
                new("AccountBalance", ((double?)await zusContext.AdvancedFormResults.AverageAsync(x => x.AccountBalance)) ?? 0),
                new("MonthlyIncome", ((double?)await zusContext.AdvancedFormResults.AverageAsync(x => x.MonthlyIncome)) ?? 0),
                new("RetirementAge", await zusContext.AdvancedFormResults.AverageAsync(x => x.RetirementAge) ?? 0),
                new("SubAccountBalance", ((double?)await zusContext.AdvancedFormResults.AverageAsync(x => x.SubAccountBalance)) ?? 0),
            };

            var listSimple = new List<Tuple<string, double>> {
                new("InitialCapital", ((double?)await zusContext.SimpleFormResults.AverageAsync(x => x.InitialCapital)) ?? 0),
                new("CurrentAge", await zusContext.SimpleFormResults.AverageAsync(x => x.CurrentAge) ?? 0),
                new("MonthlyIncome", ((double?)await zusContext.SimpleFormResults.AverageAsync(x => x.MonthlyIncome)) ?? 0),
                new("RetirementAge", await zusContext.SimpleFormResults.AverageAsync(x => x.RetirementAge) ?? 0),
            };

            return listAdvanced.Concat(listSimple);
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

        public async Task<IEnumerable<IEnumerable<Tuple<string, double>>>> TotalPercentageUsage()
        {
            // Helper function to calculate percentage usage for a grouping
            async Task<IEnumerable<Tuple<string, double>>> GetPercentageUsageAsync<T>(
                IQueryable<T> source,
                Func<T, object?> groupSelector)
            {
                var totalCount = await source.CountAsync();
                if (totalCount == 0)
                    return Enumerable.Empty<Tuple<string, double>>();

                var grouped = source
                    .GroupBy(groupSelector)
                    .Select(g => new Tuple<string, double>(
                        g.Key == null ? "Unknown" : g.Key.ToString()!,
                        (double)g.Count() / totalCount * 100))
                    .ToList(); // Use ToList() instead of ToListAsync()

                return grouped;
            }

            var advancedEmploymentType = await GetPercentageUsageAsync(zusContext.AdvancedFormResults, x => x.EmploymentType);
            var advancedGender = await GetPercentageUsageAsync(zusContext.AdvancedFormResults, x => x.Gender);
            var advancedRetirementAge = await GetPercentageUsageAsync(zusContext.AdvancedFormResults, x => x.RetirementAge);

            var simpleEmploymentType = await GetPercentageUsageAsync(zusContext.SimpleFormResults, x => x.EmploymentType);
            var simpleGender = await GetPercentageUsageAsync(zusContext.SimpleFormResults, x => x.Gender);
            var simpleRetirementAge = await GetPercentageUsageAsync(zusContext.SimpleFormResults, x => x.RetirementAge);

            // Return as a list of groupings
            return new List<IEnumerable<Tuple<string, double>>>
            {
                advancedEmploymentType,
                advancedGender,
                advancedRetirementAge,
                simpleEmploymentType,
                simpleGender,
                simpleRetirementAge
            };
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
