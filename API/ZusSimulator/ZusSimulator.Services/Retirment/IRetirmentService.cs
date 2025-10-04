using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZusSimulator.Services.Models;

namespace ZusSimulator.Services.Retirment
{
    public interface IRetirmentService
    {
        public Task<int> GetRetirment(RetirmentDataModel retirmentData);
    }
}
