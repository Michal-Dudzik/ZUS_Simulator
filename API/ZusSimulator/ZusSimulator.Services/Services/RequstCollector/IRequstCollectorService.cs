using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZusSimulator.Services.Models;

namespace ZusSimulator.Services.Services.RequstCollector
{
    public interface IRequstCollectorService
    {
        Task<int> SaveSimpleFormResultAsync(SimpleFormResultRequest request);
        Task<int> SaveAdvancedFormResultAsync(AdvancedFormResultRequest request);
        Task<bool> UpdateWithPersonalData(PersonalDataRequest request);
    }
}
