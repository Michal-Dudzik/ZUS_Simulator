using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZusSimulator.Data.BaseContext.Entities
{
    public class AiResults
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Results { get; set; }
    }
}
