using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZusSimulator.Services.Services.AdminPanel
{
    public interface IAdminPanelService
    {
        Task<int> TotalRequests();
        Task<int> TotalSimpleRequests();
        Task<int> TotalAdvancedRequests();
        Task<int> TotalPersonalDataAdded();

        Task<IEnumerable<Tuple<string, double>>> TotalAveragess();
        Task<IEnumerable<Tuple<string, int>>> TotalMins();
        Task<IEnumerable<Tuple<string, int>>> TotalMaxes();
        Task<IEnumerable<IEnumerable<Tuple<string, double>>>> TotalPercentageUsage();


    }
}
