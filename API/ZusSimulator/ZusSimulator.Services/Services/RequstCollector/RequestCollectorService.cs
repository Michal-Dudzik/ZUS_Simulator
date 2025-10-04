using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZusSimulator.Data.BaseContext;
using ZusSimulator.Data.BaseContext.Entities;
using ZusSimulator.Services.Models;

namespace ZusSimulator.Services.Services.RequstCollector
{
    public class RequestCollectorService : IRequstCollectorService
    {
        private readonly ZusContext zusContext;

        public RequestCollectorService(ZusContext zusContext)
        {
            this.zusContext = zusContext;
        }

        public async Task<int> SaveAdvancedFormResultAsync(AdvancedFormResultRequest request)
        {
            var dbo = await zusContext.AdvancedFormResults.AddAsync(new AdvancedFormResult
            {
                CurrentAge = request.CurrentAge,
                MonthlyIncome = request.MonthlyIncome,
                EmploymentType = request.EmploymentType,
                AccountBalance = request.AccountBalance,
                Gender = request.Gender,
                InitialCapital = request.InitialCapital,
                RetirementAge = request.RetirementAge,
                SickLeaveDays = request.SickLeaveDays,
                SubAccountBalance = request.SubAccountBalance,
                WorkStartDate = request.WorkStartDate
            });

            await zusContext.SaveChangesAsync();
            return dbo.Entity.Id;
        }

        public async Task<int> SaveSimpleFormResultAsync(SimpleFormResultRequest request)
        {
            var dbo = await zusContext.SimpleFormResults.AddAsync(new SimpleFormResult
            {
                CurrentAge = request.CurrentAge,
                MonthlyIncome = request.MonthlyIncome,
                EmploymentType = request.EmploymentType,
                Gender = request.Gender,
                InitialCapital = request.InitialCapital,
                RetirementAge = request.RetirementAge,
                WorkStartDate = request.WorkStartDate
            });

            await zusContext.SaveChangesAsync();
            return dbo.Entity.Id;
        }

        public async Task<bool> UpdateWithPersonalData(PersonalDataRequest request)
        {
            var simple = await zusContext.SimpleFormResults.FirstAsync(x => x.Id == request.FormResultId);
            var advanced = await zusContext.AdvancedFormResults.FirstAsync(x => x.Id == request.FormResultId);

            if (simple != null)
            {
                simple.Email = request.Email;
                simple.PostalCode = request.PostalCode;
            }
            else if (advanced != null)
            {
                advanced.Email = request.Email;
                advanced.PostalCode = request.PostalCode;
            }
            else
            {
                return false;
            }

            await zusContext.SaveChangesAsync();
            return true;
        }
    }
}
